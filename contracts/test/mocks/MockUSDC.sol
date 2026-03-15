// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title MockUSDC
 * @notice Simple ERC20 mock for testing USDC interactions
 * @dev 6 decimal places like real USDC
 */
contract MockUSDC is ERC20 {
    constructor() ERC20("USD Coin", "USDC") {
        // Mint 1 million USDC to deployer
        _mint(msg.sender, 1_000_000 * 10 ** 6);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }

    /**
     * @notice Mint tokens for testing
     */
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
