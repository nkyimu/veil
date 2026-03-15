// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "forge-std/Script.sol";
import "../src/VeilVault.sol";
import "../test/mocks/MockUSDC.sol";

/**
 * @title Deploy Script for VeilVault
 * @notice Deploys VeilVault with appropriate USDC token for the network
 * @dev Supports Base Mainnet and Base Sepolia (with MockUSDC fallback)
 */
contract DeployVeilVault is Script {
    // Base Mainnet USDC
    address constant BASE_MAINNET_USDC = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
    
    // Base Sepolia Chain ID
    uint256 constant BASE_SEPOLIA_CHAIN_ID = 84532;
    
    // Base Mainnet Chain ID
    uint256 constant BASE_MAINNET_CHAIN_ID = 8453;

    // Deployment parameters
    uint256 constant DEFAULT_QUERY_FEE = 20000; // $0.02 USDC (6 decimals)
    uint256 constant PLATFORM_FEE_BPS = 250; // 2.5%
    uint256 constant QUERY_EXPIRY = 86400; // 24 hours

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployer = vm.addr(deployerPrivateKey);

        console2.log("Deploying VeilVault...");
        console2.log("Deployer:", deployer);
        console2.log("Chain ID:", block.chainid);

        address usdc = getUSDCAddress();
        console2.log("USDC Address:", usdc);

        vm.startBroadcast(deployerPrivateKey);

        VeilVault vault = new VeilVault(
            usdc,
            DEFAULT_QUERY_FEE,
            PLATFORM_FEE_BPS,
            QUERY_EXPIRY
        );

        vm.stopBroadcast();

        console2.log("VeilVault deployed at:", address(vault));
        console2.log("Default Query Fee:", DEFAULT_QUERY_FEE);
        console2.log("Platform Fee BPS:", PLATFORM_FEE_BPS);
        console2.log("Query Expiry:", QUERY_EXPIRY);
    }

    /**
     * @notice Get the appropriate USDC token address for the current network
     * @return usdc address of USDC on the network
     */
    function getUSDCAddress() public returns (address) {
        if (block.chainid == BASE_MAINNET_CHAIN_ID) {
            return BASE_MAINNET_USDC;
        } else if (block.chainid == BASE_SEPOLIA_CHAIN_ID) {
            // Deploy MockUSDC for Sepolia
            console2.log("Deploying MockUSDC for Base Sepolia...");
            MockUSDC mockUsdc = new MockUSDC();
            console2.log("MockUSDC deployed at:", address(mockUsdc));
            return address(mockUsdc);
        } else {
            revert("Unsupported network");
        }
    }
}
