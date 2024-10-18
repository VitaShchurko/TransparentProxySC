// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TransparentUpgradeableProxy {
    bytes32 private constant _IMPLEMENTATION_SLOT = keccak256("proxy.implementation.slot");
    bytes32 private constant _ADMIN_SLOT = keccak256("proxy.admin.slot");
    
    event Upgraded(address indexed implementation);

    constructor(address implementation, address admin) {
        _setImplementation(implementation);
        _setAdmin(admin);
    }

    receive() external payable {}

    fallback() external payable {
        address impl = _getImplementation();
        require(impl != address(0), "Implementation address is zero");
        assembly {
            let ptr := mload(0x40)
            calldatacopy(ptr, 0, calldatasize())
            let result := delegatecall(gas(), impl, ptr, calldatasize(), 0, 0)
            let size := returndatasize()
            returndatacopy(ptr, 0, size)
            switch result
            case 0 { revert(ptr, size) }
            default { return(ptr, size) }
        }
    }

    function getImplementation() public view returns (address) {
        return _getImplementation();
    }

    function upgradeTo(address newImplementation) external {
        require(msg.sender == _getAdmin(), "Only admin can upgrade");
        _setImplementation(newImplementation);
        emit Upgraded(newImplementation);
    }

    function _getImplementation() internal view returns (address impl) {
        bytes32 slot = _IMPLEMENTATION_SLOT;
        assembly {
            impl := sload(slot)
        }
    }

    function _setImplementation(address newImplementation) internal {
        bytes32 slot = _IMPLEMENTATION_SLOT;
        assembly {
            sstore(slot, newImplementation)
        }
    }

    function _getAdmin() internal view returns (address admin) {
        bytes32 slot = _ADMIN_SLOT;
        assembly {
            admin := sload(slot)
        }
    }

    function _setAdmin(address newAdmin) internal {
        bytes32 slot = _ADMIN_SLOT;
        assembly {
            sstore(slot, newAdmin)
        }
    }
}
