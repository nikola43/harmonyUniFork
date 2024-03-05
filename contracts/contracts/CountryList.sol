// Sources flattened with hardhat v2.17.0 https://hardhat.org

// File contracts/ICountryList.sol

// SPDX-License-Identifier: MIT


pragma solidity ^0.8.0;
/**
 * @dev Interface of the CountryList contract
 */
interface ICountryList {
  function countryIsValid (uint16 _countryCode) external view returns (bool);
}


// File contracts/Context.sol

// File @openzeppelin/contracts/utils/Context.sol@v4.0.0



/*
 * @dev Provides information about the current execution context, including the
 * sender of the transaction and its data. While these are generally available
 * via msg.sender and msg.data, they should not be accessed in such a direct
 * manner, since when dealing with meta-transactions the account sending and
 * paying for execution may not be the actual sender (as far as an application
 * is concerned).
 *
 * This contract is only required for intermediate, library-like contracts.
 */
abstract contract Context {
    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function _msgData() internal view virtual returns (bytes calldata) {
        this; // silence state mutability warning without generating bytecode - see https://github.com/ethereum/solidity/issues/2691
        return msg.data;
    }
}


// File contracts/Ownable.sol

// File @openzeppelin/contracts/access/Ownable.sol@v4.0.0



/**
 * @dev Contract module which provides a basic access control mechanism, where
 * there is an account (an owner) that can be granted exclusive access to
 * specific functions.
 *
 * By default, the owner account will be the one that deploys the contract. This
 * can later be changed with {transferOwnership}.
 *
 * This module is used through inheritance. It will make available the modifier
 * `onlyOwner`, which can be applied to your functions to restrict their use to
 * the owner.
 */
abstract contract Ownable is Context {
    address private _owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Initializes the contract setting the deployer as the initial owner.
     */
    constructor () {
        address msgSender = _msgSender();
        _owner = msgSender;
        emit OwnershipTransferred(address(0), msgSender);
    }

    /**
     * @dev Returns the address of the current owner.
     */
    function owner() public view virtual returns (address) {
        return _owner;
    }

    /**
     * @dev Throws if called by any account other than the owner.
     */
    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    /**
     * @dev Leaves the contract without owner. It will not be possible to call
     * `onlyOwner` functions anymore. Can only be called by the current owner.
     *
     * NOTE: Renouncing ownership will leave the contract without an owner,
     * thereby removing any functionality that is only available to the owner.
     */
    function renounceOwnership() public virtual onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }

    /**
     * @dev Transfers ownership of the contract to a new account (`newOwner`).
     * Can only be called by the current owner.
     */
    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }
}


// File contracts/CountryList.sol

// ALL RIGHTS RESERVED
// Unicrypt by SDDTech reserves all rights on this code. You may NOT copy these contracts.




contract CountryList is Ownable, ICountryList {

    // disable a country code with the COUNTRY_BAN_LIST, true = banned, false = allowed
    mapping (uint16 => bool) public COUNTRY_BAN_LIST;
    uint16 public MAX_UINT = 252;

    function setMaxUint (uint16 _maxUint) external onlyOwner {
        MAX_UINT = _maxUint;
    }
    
    function setCountryRule (uint16 _countryCode, bool _banned) external onlyOwner {
        require(_countryCode <= MAX_UINT, "INVALID CODE");
        COUNTRY_BAN_LIST[_countryCode] = _banned;
    }

    // call this function from external contracts to verify if a specified country code is allowed
    function countryIsValid (uint16 _countryCode) external view override returns (bool) {
        if (_countryCode > MAX_UINT) {
            return false;
        }
        if (COUNTRY_BAN_LIST[_countryCode]) {
            return false;
        }
        return true;
    }

}
