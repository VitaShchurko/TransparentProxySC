// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract ImplementationV2 {
    uint256 private value;

    function setValue(uint256 newValue) external {
        value = newValue;
    }

    function getValue() external view returns (uint256) {
        return value;
    }

    function doubleValue() external view returns (uint256) {
        return value * 2;
    }
}