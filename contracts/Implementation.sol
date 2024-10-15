// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Implementation {
    uint256 internal value;

    constructor() {
        value = 0;
    }

    function setValue(uint256 newValue) public {
        value = newValue;
    }

    function getValue() public view returns (uint256) {
        return value;
    }
}