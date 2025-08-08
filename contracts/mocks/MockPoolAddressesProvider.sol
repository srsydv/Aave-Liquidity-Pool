// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

contract MockPoolAddressesProvider {
    address private poolAddress;

    constructor(address _poolAddress) {
        poolAddress = _poolAddress;
    }

    function getPool() external view returns (address) {
        return poolAddress;
    }
} 