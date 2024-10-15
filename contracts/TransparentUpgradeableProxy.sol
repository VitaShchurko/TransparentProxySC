// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TransparentUpgradeableProxy {
    address private _implementation;
    address private _admin;
    
    event Upgraded(address indexed implementation);

    constructor(address implementation, address admin) {
        _implementation = implementation;
        _admin = admin;
    }

		receive() external payable {}

    fallback() external payable {
        address impl = _implementation;
        require(impl != address(0), "Implementation address is zero");
        assembly {
            calldatacopy(0, 0, calldatasize())
            let result := delegatecall(gas(), impl, 0, calldatasize(), 0, 0)
            returndatacopy(0, 0, returndatasize())
            switch result
            case 0 { revert(0, returndatasize()) }
            default { return(0, returndatasize()) }
        }
    }

		function getImplementation() public view returns (address) {
        return _implementation;
    }

    function upgradeTo(address newImplementation) external {
        require(msg.sender == _admin, "Only admin can upgrade");
        _implementation = newImplementation;
        emit Upgraded(newImplementation);
    }
}