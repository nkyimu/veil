// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Test.sol";
import "../src/VeilVault.sol";
import "./mocks/MockUSDC.sol";

/**
 * @title VeilVault Test Suite
 * @notice Comprehensive tests for credential storage, queries, revenue, and access control
 */
contract VeilVaultTest is Test {
    VeilVault vault;
    MockUSDC usdc;

    // Test accounts
    address owner = address(0x1);
    address alice = address(0x2); // Data owner
    address bob = address(0x3); // Query requester
    address charlie = address(0x4); // Agent
    address mallory = address(0x5); // Attacker

    // Deployment params
    uint256 constant DEFAULT_QUERY_FEE = 20000; // $0.02 USDC (6 decimals)
    uint256 constant PLATFORM_FEE_BPS = 250; // 2.5%
    uint256 constant QUERY_EXPIRY = 86400; // 24 hours

    // Test credentials
    bytes32 constant AGE_COMMITMENT = keccak256(abi.encodePacked("age", uint256(25), bytes32("salt123")));
    bytes32 constant CREDIT_COMMITMENT = keccak256(abi.encodePacked("credit", uint256(750), bytes32("salt456")));
    bytes32 constant LOCATION_COMMITMENT = keccak256(abi.encodePacked("location", uint256(1), bytes32("salt789")));

    // Query hashes
    bytes32 constant AGE_18_QUERY = keccak256(abi.encodePacked("age >= 18"));
    bytes32 constant CREDIT_700_QUERY = keccak256(abi.encodePacked("credit_score >= 700"));

    event CredentialStored(address indexed owner, VeilVault.CredentialType indexed credType, bytes32 commitment);
    event CredentialRevoked(address indexed owner, VeilVault.CredentialType indexed credType);
    event QueryCreated(uint256 indexed queryId, address indexed requester, address indexed dataOwner, VeilVault.CredentialType credType, uint256 payment);
    event QueryAnswered(uint256 indexed queryId, bool answer);
    event QueryExpired(uint256 indexed queryId);
    event RevenueWithdrawn(address indexed owner, uint256 amount);
    event AgentRegistered(address indexed owner, address indexed agent);
    event QueryFeeUpdated(address indexed owner, uint256 newFee);

    function setUp() public {
        // Deploy USDC mock
        usdc = new MockUSDC();

        // Deploy vault as owner
        vm.prank(owner);
        vault = new VeilVault(
            address(usdc),
            DEFAULT_QUERY_FEE,
            PLATFORM_FEE_BPS,
            QUERY_EXPIRY
        );

        // Distribute USDC to test accounts
        usdc.mint(alice, 1_000_000 * 10 ** 6);
        usdc.mint(bob, 1_000_000 * 10 ** 6);
        usdc.mint(charlie, 1_000_000 * 10 ** 6);
        usdc.mint(mallory, 1_000_000 * 10 ** 6);

        // Approve vault to spend USDC
        vm.prank(alice);
        usdc.approve(address(vault), type(uint256).max);

        vm.prank(bob);
        usdc.approve(address(vault), type(uint256).max);

        vm.prank(charlie);
        usdc.approve(address(vault), type(uint256).max);

        vm.prank(mallory);
        usdc.approve(address(vault), type(uint256).max);
    }

    // ========================================
    // Credential Storage Tests
    // ========================================

    function test_storeCredential() public {
        vm.prank(alice);
        vm.expectEmit(true, true, true, true);
        emit CredentialStored(alice, VeilVault.CredentialType.Age, AGE_COMMITMENT);

        vault.storeCredential(VeilVault.CredentialType.Age, AGE_COMMITMENT);

        VeilVault.Credential memory cred = vault.getCredential(alice, VeilVault.CredentialType.Age);
        assertEq(cred.commitment, AGE_COMMITMENT);
        assertEq(uint256(cred.credType), uint256(VeilVault.CredentialType.Age));
        assertTrue(cred.active);
    }

    function test_storeMultipleCredentials() public {
        vm.startPrank(alice);
        vault.storeCredential(VeilVault.CredentialType.Age, AGE_COMMITMENT);
        vault.storeCredential(VeilVault.CredentialType.CreditRange, CREDIT_COMMITMENT);
        vault.storeCredential(VeilVault.CredentialType.Location, LOCATION_COMMITMENT);
        vm.stopPrank();

        VeilVault.Credential memory ageCred = vault.getCredential(alice, VeilVault.CredentialType.Age);
        VeilVault.Credential memory creditCred = vault.getCredential(alice, VeilVault.CredentialType.CreditRange);
        VeilVault.Credential memory locCred = vault.getCredential(alice, VeilVault.CredentialType.Location);

        assertEq(ageCred.commitment, AGE_COMMITMENT);
        assertEq(creditCred.commitment, CREDIT_COMMITMENT);
        assertEq(locCred.commitment, LOCATION_COMMITMENT);
    }

    function test_storeCredential_rejectEmptyCommitment() public {
        vm.prank(alice);
        vm.expectRevert("Empty commitment");
        vault.storeCredential(VeilVault.CredentialType.Age, bytes32(0));
    }

    function test_revokeCredential() public {
        vm.startPrank(alice);
        vault.storeCredential(VeilVault.CredentialType.Age, AGE_COMMITMENT);

        vm.expectEmit(true, true, true, true);
        emit CredentialRevoked(alice, VeilVault.CredentialType.Age);
        vault.revokeCredential(VeilVault.CredentialType.Age);
        vm.stopPrank();

        VeilVault.Credential memory cred = vault.getCredential(alice, VeilVault.CredentialType.Age);
        assertFalse(cred.active);
    }

    function test_revokeCredential_notActive() public {
        vm.prank(alice);
        vm.expectRevert("No active credential");
        vault.revokeCredential(VeilVault.CredentialType.Age);
    }

    // ========================================
    // Query Lifecycle Tests
    // ========================================

    function test_submitQuery() public {
        // Setup: Alice stores credential
        vm.prank(alice);
        vault.storeCredential(VeilVault.CredentialType.Age, AGE_COMMITMENT);

        // Bob submits query
        vm.prank(bob);
        vm.expectEmit(true, true, true, true);
        emit QueryCreated(1, bob, alice, VeilVault.CredentialType.Age, DEFAULT_QUERY_FEE);
        uint256 queryId = vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);

        assertEq(queryId, 1);

        VeilVault.QueryRequest memory q = vault.getQuery(queryId);
        assertEq(q.requester, bob);
        assertEq(q.dataOwner, alice);
        assertEq(q.payment, DEFAULT_QUERY_FEE);
        assertEq(uint256(q.status), uint256(VeilVault.QueryStatus.Pending));
    }

    function test_submitQuery_noActiveCredential() public {
        vm.prank(bob);
        vm.expectRevert("No active credential");
        vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);
    }

    function test_submitQuery_transfersPayment() public {
        vm.prank(alice);
        vault.storeCredential(VeilVault.CredentialType.Age, AGE_COMMITMENT);

        uint256 bobBalanceBefore = usdc.balanceOf(bob);
        uint256 vaultBalanceBefore = usdc.balanceOf(address(vault));

        vm.prank(bob);
        vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);

        uint256 bobBalanceAfter = usdc.balanceOf(bob);
        uint256 vaultBalanceAfter = usdc.balanceOf(address(vault));

        assertEq(bobBalanceBefore - bobBalanceAfter, DEFAULT_QUERY_FEE);
        assertEq(vaultBalanceAfter - vaultBalanceBefore, DEFAULT_QUERY_FEE);
    }

    function test_answerQuery() public {
        // Setup: Alice stores credential, Bob submits query
        vm.prank(alice);
        vault.storeCredential(VeilVault.CredentialType.Age, AGE_COMMITMENT);

        vm.prank(bob);
        uint256 queryId = vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);

        // Alice answers
        vm.prank(alice);
        vm.expectEmit(true, true, true, true);
        emit QueryAnswered(queryId, true);
        vault.answerQuery(queryId, true, "");

        VeilVault.QueryRequest memory q = vault.getQuery(queryId);
        assertEq(uint256(q.status), uint256(VeilVault.QueryStatus.Answered));
        assertTrue(q.answer);
        assertGt(q.answeredAt, 0);
    }

    function test_answerQuery_onlyOwnerOrAgent() public {
        // Setup
        vm.prank(alice);
        vault.storeCredential(VeilVault.CredentialType.Age, AGE_COMMITMENT);

        vm.prank(bob);
        uint256 queryId = vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);

        // Mallory tries to answer (should fail)
        vm.prank(mallory);
        vm.expectRevert("Not authorized");
        vault.answerQuery(queryId, true, "");
    }

    function test_answerQuery_expiredQuery() public {
        // Setup
        vm.prank(alice);
        vault.storeCredential(VeilVault.CredentialType.Age, AGE_COMMITMENT);

        vm.prank(bob);
        uint256 queryId = vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);

        // Jump past expiry
        vm.warp(block.timestamp + QUERY_EXPIRY + 1);

        vm.prank(alice);
        vm.expectRevert("Query expired");
        vault.answerQuery(queryId, true, "");
    }

    function test_answerQuery_notPending() public {
        // Setup and answer once
        vm.prank(alice);
        vault.storeCredential(VeilVault.CredentialType.Age, AGE_COMMITMENT);

        vm.prank(bob);
        uint256 queryId = vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);

        vm.prank(alice);
        vault.answerQuery(queryId, true, "");

        // Try to answer again
        vm.prank(alice);
        vm.expectRevert("Query not pending");
        vault.answerQuery(queryId, false, "");
    }

    function test_answerQuery_byAgent() public {
        // Setup: Alice registers Charlie as agent
        vm.prank(alice);
        vault.registerAgent(charlie);

        vm.prank(alice);
        vault.storeCredential(VeilVault.CredentialType.Age, AGE_COMMITMENT);

        vm.prank(bob);
        uint256 queryId = vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);

        // Charlie (agent) answers
        vm.prank(charlie);
        vault.answerQuery(queryId, true, "");

        VeilVault.QueryRequest memory q = vault.getQuery(queryId);
        assertEq(uint256(q.status), uint256(VeilVault.QueryStatus.Answered));
    }

    // ========================================
    // Platform Fee & Revenue Tests
    // ========================================

    function test_platformFeeCalculation() public {
        // Setup
        vm.prank(alice);
        vault.storeCredential(VeilVault.CredentialType.Age, AGE_COMMITMENT);

        vm.prank(bob);
        uint256 queryId = vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);

        // Answer query
        vm.prank(alice);
        vault.answerQuery(queryId, true, "");

        // Check revenue split
        // Expected: platformCut = 20000 * 250 / 10000 = 500
        // Expected: ownerRevenue = 20000 - 500 = 19500
        (uint256 pending, uint256 total, ) = vault.getEarnings(alice);
        assertEq(pending, 19500);
        assertEq(total, 19500);
    }

    function test_platformRevenueAccumulation() public {
        // Setup: multiple queries
        vm.prank(alice);
        vault.storeCredential(VeilVault.CredentialType.Age, AGE_COMMITMENT);

        // Submit 3 queries
        vm.startPrank(bob);
        vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);
        vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);
        vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);
        vm.stopPrank();

        // Answer all queries
        vm.startPrank(alice);
        vault.answerQuery(1, true, "");
        vault.answerQuery(2, false, "");
        vault.answerQuery(3, true, "");
        vm.stopPrank();

        // Platform fee per query: 500 (20000 * 250 / 10000)
        // Total platform revenue: 1500
        // Total owner revenue: 58500 (3 * 19500)
        uint256 platformRev = vault.platformRevenue();
        assertEq(platformRev, 1500);

        (uint256 pending, uint256 total, ) = vault.getEarnings(alice);
        assertEq(total, 58500);
    }

    // ========================================
    // Query Expiry & Refund Tests
    // ========================================

    function test_expireQuery_refundsRequester() public {
        // Setup
        vm.prank(alice);
        vault.storeCredential(VeilVault.CredentialType.Age, AGE_COMMITMENT);

        uint256 bobBalanceBefore = usdc.balanceOf(bob);

        vm.prank(bob);
        uint256 queryId = vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);

        uint256 bobAfterSubmit = usdc.balanceOf(bob);
        assertEq(bobBalanceBefore - bobAfterSubmit, DEFAULT_QUERY_FEE);

        // Jump past expiry
        vm.warp(block.timestamp + QUERY_EXPIRY + 1);

        vm.expectEmit(true, true, true, true);
        emit QueryExpired(queryId);
        vault.expireQuery(queryId);

        VeilVault.QueryRequest memory q = vault.getQuery(queryId);
        assertEq(uint256(q.status), uint256(VeilVault.QueryStatus.Expired));

        // Check refund
        uint256 bobFinal = usdc.balanceOf(bob);
        assertEq(bobFinal, bobBalanceBefore);
    }

    function test_expireQuery_notYetExpired() public {
        vm.prank(alice);
        vault.storeCredential(VeilVault.CredentialType.Age, AGE_COMMITMENT);

        vm.prank(bob);
        uint256 queryId = vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);

        // Try to expire before expiry time
        vm.expectRevert("Not expired yet");
        vault.expireQuery(queryId);
    }

    function test_expireQuery_notPending() public {
        vm.prank(alice);
        vault.storeCredential(VeilVault.CredentialType.Age, AGE_COMMITMENT);

        vm.prank(bob);
        uint256 queryId = vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);

        // Answer the query
        vm.prank(alice);
        vault.answerQuery(queryId, true, "");

        // Try to expire answered query
        vm.warp(block.timestamp + QUERY_EXPIRY + 1);
        vm.expectRevert("Query not pending");
        vault.expireQuery(queryId);
    }

    // ========================================
    // Revenue Withdrawal Tests
    // ========================================

    function test_withdrawRevenue() public {
        // Setup: Answer a query
        vm.prank(alice);
        vault.storeCredential(VeilVault.CredentialType.Age, AGE_COMMITMENT);

        vm.prank(bob);
        uint256 queryId = vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);

        vm.prank(alice);
        vault.answerQuery(queryId, true, "");

        uint256 aliceBalanceBefore = usdc.balanceOf(alice);
        (uint256 pending, , ) = vault.getEarnings(alice);
        assertEq(pending, 19500);

        // Withdraw
        vm.prank(alice);
        vm.expectEmit(true, true, true, true);
        emit RevenueWithdrawn(alice, 19500);
        vault.withdrawRevenue();

        uint256 aliceBalanceAfter = usdc.balanceOf(alice);
        assertEq(aliceBalanceAfter - aliceBalanceBefore, 19500);

        (uint256 pendingAfter, , ) = vault.getEarnings(alice);
        assertEq(pendingAfter, 0);
    }

    function test_withdrawRevenue_nothingToWithdraw() public {
        vm.prank(alice);
        vm.expectRevert("No revenue to withdraw");
        vault.withdrawRevenue();
    }

    function test_withdrawPlatformRevenue() public {
        // Setup: Answer queries to accumulate platform fees
        vm.prank(alice);
        vault.storeCredential(VeilVault.CredentialType.Age, AGE_COMMITMENT);

        vm.prank(bob);
        vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);

        vm.prank(alice);
        vault.answerQuery(1, true, "");

        uint256 ownerBalanceBefore = usdc.balanceOf(owner);

        vm.prank(owner);
        vault.withdrawPlatformRevenue();

        uint256 ownerBalanceAfter = usdc.balanceOf(owner);
        assertEq(ownerBalanceAfter - ownerBalanceBefore, 500);
    }

    // ========================================
    // Agent Registration Tests
    // ========================================

    function test_registerAgent() public {
        vm.prank(alice);
        vm.expectEmit(true, true, true, true);
        emit AgentRegistered(alice, charlie);
        vault.registerAgent(charlie);

        address agent = vault.userAgents(alice);
        assertEq(agent, charlie);
    }

    function test_registerAgent_invalidAddress() public {
        vm.prank(alice);
        vm.expectRevert("Invalid agent");
        vault.registerAgent(address(0));
    }

    // ========================================
    // Custom Query Fee Tests
    // ========================================

    function test_setCustomQueryFee() public {
        uint256 customFee = 50000;

        vm.prank(alice);
        vm.expectEmit(true, true, true, true);
        emit QueryFeeUpdated(alice, customFee);
        vault.setQueryFee(customFee);

        uint256 fee = vault.getQueryFee(alice);
        assertEq(fee, customFee);
    }

    function test_submitQuery_usesCustomFee() public {
        uint256 customFee = 50000;

        vm.startPrank(alice);
        vault.setQueryFee(customFee);
        vault.storeCredential(VeilVault.CredentialType.Age, AGE_COMMITMENT);
        vm.stopPrank();

        uint256 vaultBalanceBefore = usdc.balanceOf(address(vault));

        vm.prank(bob);
        vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);

        uint256 vaultBalanceAfter = usdc.balanceOf(address(vault));
        assertEq(vaultBalanceAfter - vaultBalanceBefore, customFee);
    }

    // ========================================
    // Query Count Tests
    // ========================================

    function test_queryCount() public {
        vm.prank(alice);
        vault.storeCredential(VeilVault.CredentialType.Age, AGE_COMMITMENT);

        vm.startPrank(bob);
        vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);
        vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);
        vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);
        vm.stopPrank();

        (, , uint256 count) = vault.getEarnings(alice);
        assertEq(count, 3);
    }

    // ========================================
    // Access Control Tests
    // ========================================

    function test_setDefaultQueryFee_onlyOwner() public {
        vm.prank(alice);
        vm.expectRevert();
        vault.setDefaultQueryFee(30000);
    }

    function test_setDefaultQueryFee_byOwner() public {
        vm.prank(owner);
        vault.setDefaultQueryFee(30000);

        assertEq(vault.defaultQueryFee(), 30000);
    }

    function test_setPlatformFeeBps_onlyOwner() public {
        vm.prank(alice);
        vm.expectRevert();
        vault.setPlatformFeeBps(300);
    }

    function test_setPlatformFeeBps_maxLimit() public {
        vm.prank(owner);
        vm.expectRevert("Max 10%");
        vault.setPlatformFeeBps(1001);
    }

    function test_setQueryExpiry_onlyOwner() public {
        vm.prank(alice);
        vm.expectRevert();
        vault.setQueryExpiry(172800);
    }

    // ========================================
    // Reentrancy Tests
    // ========================================

    function test_withdrawRevenue_reentrancyGuard() public {
        // Setup: Answer a query
        vm.prank(alice);
        vault.storeCredential(VeilVault.CredentialType.Age, AGE_COMMITMENT);

        vm.prank(bob);
        uint256 queryId = vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);

        vm.prank(alice);
        vault.answerQuery(queryId, true, "");

        // Reentrancy is protected by ReentrancyGuard
        // This test just ensures the function completes without issues
        vm.prank(alice);
        vault.withdrawRevenue();
    }

    // ========================================
    // Integration Tests
    // ========================================

    function test_fullQueryLifecycle() public {
        // Alice stores credential
        vm.prank(alice);
        vault.storeCredential(VeilVault.CredentialType.Age, AGE_COMMITMENT);

        // Bob submits query
        vm.prank(bob);
        uint256 queryId = vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);

        // Verify query is pending
        VeilVault.QueryRequest memory q = vault.getQuery(queryId);
        assertEq(uint256(q.status), uint256(VeilVault.QueryStatus.Pending));

        // Alice answers
        vm.prank(alice);
        vault.answerQuery(queryId, true, "");

        // Verify query is answered
        q = vault.getQuery(queryId);
        assertEq(uint256(q.status), uint256(VeilVault.QueryStatus.Answered));
        assertTrue(q.answer);

        // Alice withdraws revenue
        vm.prank(alice);
        vault.withdrawRevenue();

        // Verify revenue is withdrawn
        (uint256 pending, uint256 total, ) = vault.getEarnings(alice);
        assertEq(pending, 0);
        assertEq(total, 19500);
    }

    function test_multiQuery_multiUser() public {
        // Alice and Charlie both store credentials
        vm.prank(alice);
        vault.storeCredential(VeilVault.CredentialType.Age, AGE_COMMITMENT);

        vm.prank(charlie);
        vault.storeCredential(VeilVault.CredentialType.CreditRange, CREDIT_COMMITMENT);

        // Bob queries both
        vm.startPrank(bob);
        uint256 queryId1 = vault.submitQuery(alice, VeilVault.CredentialType.Age, AGE_18_QUERY);
        uint256 queryId2 = vault.submitQuery(charlie, VeilVault.CredentialType.CreditRange, CREDIT_700_QUERY);
        vm.stopPrank();

        // Each answers their query
        vm.prank(alice);
        vault.answerQuery(queryId1, true, "");

        vm.prank(charlie);
        vault.answerQuery(queryId2, false, "");

        // Check earnings are separate
        (uint256 alicePending, uint256 aliceTotal, uint256 aliceCount) = vault.getEarnings(alice);
        (uint256 charliePending, uint256 charlieTotal, uint256 charlieCount) = vault.getEarnings(charlie);

        assertEq(aliceCount, 1);
        assertEq(charlieCount, 1);
        assertEq(aliceTotal, 19500);
        assertEq(charlieTotal, 19500);
    }
}
