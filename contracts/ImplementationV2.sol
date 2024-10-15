// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./Implementation.sol";

contract ImplementationV2 is Implementation {
    function doubleValue() external view returns (uint256) {
        return value * 2;
    }
}