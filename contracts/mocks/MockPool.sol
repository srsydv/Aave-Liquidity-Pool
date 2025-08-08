// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract MockPool {
    bool public supplyCalled = false;
    bool public withdrawCalled = false;
    address public lastSupplyAsset;
    uint256 public lastSupplyAmount;
    address public lastWithdrawAsset;
    uint256 public lastWithdrawAmount;

    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external {
        supplyCalled = true;
        lastSupplyAsset = asset;
        lastSupplyAmount = amount;
    }

    function withdraw(
        address asset,
        uint256 amount,
        address to
    ) external returns (uint256) {
        withdrawCalled = true;
        lastWithdrawAsset = asset;
        lastWithdrawAmount = amount;
        
        // Return 90% of the requested amount to simulate fees
        return (amount * 90) / 100;
    }

    function getUserAccountData(address user)
        external
        pure
        returns (
            uint256 totalCollateralBase,
            uint256 totalDebtBase,
            uint256 availableBorrowsBase,
            uint256 currentLiquidationThreshold,
            uint256 ltv,
            uint256 healthFactor
        )
    {
        // Return mock data
        return (
            1000000000000000000000, // 1000 tokens collateral
            500000000000000000000,  // 500 tokens debt
            300000000000000000000,  // 300 tokens available to borrow
            8000,                   // 80% liquidation threshold
            7500,                   // 75% LTV
            1500000000000000000000  // 1.5 health factor
        );
    }
} 