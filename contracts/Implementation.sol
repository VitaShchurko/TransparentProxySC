// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Implementation {
    uint256 private value;

    function setValue(uint256 newValue) external {
        value = newValue;
    }

    function getValue() external view returns (uint256) {
        return value;
    }
}