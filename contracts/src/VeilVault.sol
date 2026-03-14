// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title VeilVault
 * @notice Sovereign data vault — store credential commitments on-chain,
 *         answer queries with ZK proofs, earn micropayments per query.
 * @dev Users store hashed credentials. Services pay to query YES/NO answers
 *      (e.g. "Is user over 18?") verified by ZK proofs. Revenue goes to data owner.
 *
 * Synthesis Hackathon 2026 — "Agents that keep secrets" track
 */
contract VeilVault is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // --- Types ---

    enum CredentialType { Age, CreditRange, Location, Income, Custom }
    enum QueryStatus { Pending, Answered, Expired, Refunded }

    struct Credential {
        bytes32 commitment;       // keccak256(type, value, salt)
        CredentialType credType;
        uint256 timestamp;
        bool active;
    }

    struct QueryRequest {
        address requester;        // Service asking the question
        address dataOwner;        // User whose data is queried
        CredentialType credType;  // What type of credential to query
        bytes32 queryHash;        // Hash of the specific question (e.g. "age >= 18")
        uint256 payment;          // USDC amount paid for this query
        QueryStatus status;
        bool answer;              // YES/NO (only set after answered)
        uint256 createdAt;
        uint256 answeredAt;
    }

    // --- State ---

    // Data owner => credential type => commitment
    mapping(address => mapping(CredentialType => Credential)) public credentials;

    // Query tracking
    mapping(uint256 => QueryRequest) public queries;
    uint256 public nextQueryId;

    // Revenue tracking
    mapping(address => uint256) public pendingRevenue;
    mapping(address => uint256) public totalEarned;
    mapping(address => uint256) public queryCount;

    // Payment token (USDC on Base)
    IERC20 public paymentToken;

    // Default query fee (can be overridden per-user)
    uint256 public defaultQueryFee;

    // Per-user custom query fees
    mapping(address => uint256) public customQueryFees;
    mapping(address => bool) public hasCustomFee;

    // Platform fee (basis points, e.g., 250 = 2.5%)
    uint256 public platformFeeBps;
    uint256 public platformRevenue;

    // Agent guardian (ERC-8004 registered agent per user)
    mapping(address => address) public userAgents;

    // Query expiry duration
    uint256 public queryExpiry;

    // --- Events ---

    event CredentialStored(address indexed owner, CredentialType indexed credType, bytes32 commitment);
    event CredentialRevoked(address indexed owner, CredentialType indexed credType);
    event QueryCreated(uint256 indexed queryId, address indexed requester, address indexed dataOwner, CredentialType credType, uint256 payment);
    event QueryAnswered(uint256 indexed queryId, bool answer);
    event QueryExpired(uint256 indexed queryId);
    event RevenueWithdrawn(address indexed owner, uint256 amount);
    event AgentRegistered(address indexed owner, address indexed agent);
    event QueryFeeUpdated(address indexed owner, uint256 newFee);

    // --- Constructor ---

    constructor(
        address _paymentToken,
        uint256 _defaultQueryFee,
        uint256 _platformFeeBps,
        uint256 _queryExpiry
    ) Ownable(msg.sender) {
        paymentToken = IERC20(_paymentToken);
        defaultQueryFee = _defaultQueryFee;
        platformFeeBps = _platformFeeBps;
        queryExpiry = _queryExpiry;
        nextQueryId = 1;
    }

    // --- Credential Management ---

    /**
     * @notice Store a credential commitment on-chain
     * @param credType Type of credential (Age, CreditRange, etc.)
     * @param commitment keccak256(abi.encodePacked(credType, value, salt))
     */
    function storeCredential(
        CredentialType credType,
        bytes32 commitment
    ) external {
        require(commitment != bytes32(0), "Empty commitment");

        credentials[msg.sender][credType] = Credential({
            commitment: commitment,
            credType: credType,
            timestamp: block.timestamp,
            active: true
        });

        emit CredentialStored(msg.sender, credType, commitment);
    }

    /**
     * @notice Revoke a credential
     */
    function revokeCredential(CredentialType credType) external {
        require(credentials[msg.sender][credType].active, "No active credential");
        credentials[msg.sender][credType].active = false;
        emit CredentialRevoked(msg.sender, credType);
    }

    /**
     * @notice Set custom query fee for your data
     */
    function setQueryFee(uint256 fee) external {
        customQueryFees[msg.sender] = fee;
        hasCustomFee[msg.sender] = true;
        emit QueryFeeUpdated(msg.sender, fee);
    }

    // --- Query System ---

    /**
     * @notice Submit a query about someone's credential (pay-per-query)
     * @param dataOwner Address of the person whose data you're querying
     * @param credType Type of credential to query
     * @param queryHash Hash of the specific question being asked
     */
    function submitQuery(
        address dataOwner,
        CredentialType credType,
        bytes32 queryHash
    ) external nonReentrant returns (uint256) {
        require(credentials[dataOwner][credType].active, "No active credential");

        uint256 fee = getQueryFee(dataOwner);
        require(fee > 0, "Invalid fee");

        // Collect payment
        paymentToken.safeTransferFrom(msg.sender, address(this), fee);

        uint256 queryId = nextQueryId++;

        queries[queryId] = QueryRequest({
            requester: msg.sender,
            dataOwner: dataOwner,
            credType: credType,
            queryHash: queryHash,
            payment: fee,
            status: QueryStatus.Pending,
            answer: false,
            createdAt: block.timestamp,
            answeredAt: 0
        });

        queryCount[dataOwner]++;

        emit QueryCreated(queryId, msg.sender, dataOwner, credType, fee);
        return queryId;
    }

    /**
     * @notice Answer a query (called by data owner or their agent)
     * @dev In production, this would include a ZK proof verification step
     * @param queryId The query to answer
     * @param answer YES (true) or NO (false)
     * @param proof ZK proof bytes (placeholder — will verify via Self Protocol)
     */
    function answerQuery(
        uint256 queryId,
        bool answer,
        bytes calldata proof
    ) external nonReentrant {
        QueryRequest storage q = queries[queryId];
        require(q.status == QueryStatus.Pending, "Query not pending");
        require(
            msg.sender == q.dataOwner || msg.sender == userAgents[q.dataOwner],
            "Not authorized"
        );
        require(block.timestamp <= q.createdAt + queryExpiry, "Query expired");

        // TODO: Verify ZK proof via Self Protocol verifier
        // For MVP, we trust the data owner / agent to answer honestly
        // In production: selfProtocolVerifier.verifyQueryProof(proof, q.queryHash, q.dataOwner)

        q.answer = answer;
        q.status = QueryStatus.Answered;
        q.answeredAt = block.timestamp;

        // Calculate revenue split
        uint256 platformCut = (q.payment * platformFeeBps) / 10000;
        uint256 ownerRevenue = q.payment - platformCut;

        pendingRevenue[q.dataOwner] += ownerRevenue;
        totalEarned[q.dataOwner] += ownerRevenue;
        platformRevenue += platformCut;

        emit QueryAnswered(queryId, answer);
    }

    /**
     * @notice Expire and refund an unanswered query
     */
    function expireQuery(uint256 queryId) external nonReentrant {
        QueryRequest storage q = queries[queryId];
        require(q.status == QueryStatus.Pending, "Query not pending");
        require(block.timestamp > q.createdAt + queryExpiry, "Not expired yet");

        q.status = QueryStatus.Expired;

        // Refund requester
        paymentToken.safeTransfer(q.requester, q.payment);

        emit QueryExpired(queryId);
    }

    // --- Revenue ---

    /**
     * @notice Withdraw earned revenue
     */
    function withdrawRevenue() external nonReentrant {
        uint256 amount = pendingRevenue[msg.sender];
        require(amount > 0, "No revenue to withdraw");

        pendingRevenue[msg.sender] = 0;
        paymentToken.safeTransfer(msg.sender, amount);

        emit RevenueWithdrawn(msg.sender, amount);
    }

    /**
     * @notice Withdraw platform revenue (owner only)
     */
    function withdrawPlatformRevenue() external onlyOwner nonReentrant {
        uint256 amount = platformRevenue;
        require(amount > 0, "No platform revenue");

        platformRevenue = 0;
        paymentToken.safeTransfer(owner(), amount);
    }

    // --- Agent Registration ---

    /**
     * @notice Register an agent to act on your behalf (ERC-8004 identity)
     */
    function registerAgent(address agent) external {
        require(agent != address(0), "Invalid agent");
        userAgents[msg.sender] = agent;
        emit AgentRegistered(msg.sender, agent);
    }

    // --- View Functions ---

    function getQueryFee(address dataOwner) public view returns (uint256) {
        if (hasCustomFee[dataOwner]) {
            return customQueryFees[dataOwner];
        }
        return defaultQueryFee;
    }

    function getCredential(address owner, CredentialType credType) external view returns (Credential memory) {
        return credentials[owner][credType];
    }

    function getQuery(uint256 queryId) external view returns (QueryRequest memory) {
        return queries[queryId];
    }

    function getEarnings(address owner) external view returns (uint256 pending, uint256 total, uint256 totalQueries) {
        return (pendingRevenue[owner], totalEarned[owner], queryCount[owner]);
    }

    // --- Admin ---

    function setDefaultQueryFee(uint256 fee) external onlyOwner {
        defaultQueryFee = fee;
    }

    function setPlatformFeeBps(uint256 bps) external onlyOwner {
        require(bps <= 1000, "Max 10%");
        platformFeeBps = bps;
    }

    function setQueryExpiry(uint256 expiry) external onlyOwner {
        queryExpiry = expiry;
    }
}
