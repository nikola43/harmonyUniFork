// Sources flattened with hardhat v2.17.0 https://hardhat.org

// File contracts/Context.sol

// SPDX-License-Identifier: MIT

// File @openzeppelin/contracts/utils/Context.sol@v4.0.0

pragma solidity ^0.8.0;

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


// File contracts/EnumerableSet.sol

// File @openzeppelin/contracts/utils/structs/EnumerableSet.sol@v4.0.0



/**
 * @dev Library for managing
 * https://en.wikipedia.org/wiki/Set_(abstract_data_type)[sets] of primitive
 * types.
 *
 * Sets have the following properties:
 *
 * - Elements are added, removed, and checked for existence in constant time
 * (O(1)).
 * - Elements are enumerated in O(n). No guarantees are made on the ordering.
 *
 * ```
 * contract Example {
 *     // Add the library methods
 *     using EnumerableSet for EnumerableSet.AddressSet;
 *
 *     // Declare a set state variable
 *     EnumerableSet.AddressSet private mySet;
 * }
 * ```
 *
 * As of v3.3.0, sets of type `bytes32` (`Bytes32Set`), `address` (`AddressSet`)
 * and `uint256` (`UintSet`) are supported.
 */
library EnumerableSet {
    // To implement this library for multiple types with as little code
    // repetition as possible, we write it in terms of a generic Set type with
    // bytes32 values.
    // The Set implementation uses private functions, and user-facing
    // implementations (such as AddressSet) are just wrappers around the
    // underlying Set.
    // This means that we can only create new EnumerableSets for types that fit
    // in bytes32.

    struct Set {
        // Storage of set values
        bytes32[] _values;

        // Position of the value in the `values` array, plus 1 because index 0
        // means a value is not in the set.
        mapping (bytes32 => uint256) _indexes;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function _add(Set storage set, bytes32 value) private returns (bool) {
        if (!_contains(set, value)) {
            set._values.push(value);
            // The value is stored at length-1, but we add 1 to all indexes
            // and use 0 as a sentinel value
            set._indexes[value] = set._values.length;
            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function _remove(Set storage set, bytes32 value) private returns (bool) {
        // We read and store the value"s index to prevent multiple reads from the same storage slot
        uint256 valueIndex = set._indexes[value];

        if (valueIndex != 0) { // Equivalent to contains(set, value)
            // To delete an element from the _values array in O(1), we swap the element to delete with the last one in
            // the array, and then remove the last element (sometimes called as "swap and pop").
            // This modifies the order of the array, as noted in {at}.

            uint256 toDeleteIndex = valueIndex - 1;
            uint256 lastIndex = set._values.length - 1;

            // When the value to delete is the last one, the swap operation is unnecessary. However, since this occurs
            // so rarely, we still do the swap anyway to avoid the gas cost of adding an "if" statement.

            bytes32 lastvalue = set._values[lastIndex];

            // Move the last value to the index where the value to delete is
            set._values[toDeleteIndex] = lastvalue;
            // Update the index for the moved value
            set._indexes[lastvalue] = toDeleteIndex + 1; // All indexes are 1-based

            // Delete the slot where the moved value was stored
            set._values.pop();

            // Delete the index for the deleted slot
            delete set._indexes[value];

            return true;
        } else {
            return false;
        }
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function _contains(Set storage set, bytes32 value) private view returns (bool) {
        return set._indexes[value] != 0;
    }

    /**
     * @dev Returns the number of values on the set. O(1).
     */
    function _length(Set storage set) private view returns (uint256) {
        return set._values.length;
    }

   /**
    * @dev Returns the value stored at position `index` in the set. O(1).
    *
    * Note that there are no guarantees on the ordering of values inside the
    * array, and it may change when more values are added or removed.
    *
    * Requirements:
    *
    * - `index` must be strictly less than {length}.
    */
    function _at(Set storage set, uint256 index) private view returns (bytes32) {
        require(set._values.length > index, "EnumerableSet: index out of bounds");
        return set._values[index];
    }

    // Bytes32Set

    struct Bytes32Set {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(Bytes32Set storage set, bytes32 value) internal returns (bool) {
        return _add(set._inner, value);
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(Bytes32Set storage set, bytes32 value) internal returns (bool) {
        return _remove(set._inner, value);
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(Bytes32Set storage set, bytes32 value) internal view returns (bool) {
        return _contains(set._inner, value);
    }

    /**
     * @dev Returns the number of values in the set. O(1).
     */
    function length(Bytes32Set storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

   /**
    * @dev Returns the value stored at position `index` in the set. O(1).
    *
    * Note that there are no guarantees on the ordering of values inside the
    * array, and it may change when more values are added or removed.
    *
    * Requirements:
    *
    * - `index` must be strictly less than {length}.
    */
    function at(Bytes32Set storage set, uint256 index) internal view returns (bytes32) {
        return _at(set._inner, index);
    }

    // AddressSet

    struct AddressSet {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(AddressSet storage set, address value) internal returns (bool) {
        return _add(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(AddressSet storage set, address value) internal returns (bool) {
        return _remove(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(AddressSet storage set, address value) internal view returns (bool) {
        return _contains(set._inner, bytes32(uint256(uint160(value))));
    }

    /**
     * @dev Returns the number of values in the set. O(1).
     */
    function length(AddressSet storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

   /**
    * @dev Returns the value stored at position `index` in the set. O(1).
    *
    * Note that there are no guarantees on the ordering of values inside the
    * array, and it may change when more values are added or removed.
    *
    * Requirements:
    *
    * - `index` must be strictly less than {length}.
    */
    function at(AddressSet storage set, uint256 index) internal view returns (address) {
        return address(uint160(uint256(_at(set._inner, index))));
    }


    // UintSet

    struct UintSet {
        Set _inner;
    }

    /**
     * @dev Add a value to a set. O(1).
     *
     * Returns true if the value was added to the set, that is if it was not
     * already present.
     */
    function add(UintSet storage set, uint256 value) internal returns (bool) {
        return _add(set._inner, bytes32(value));
    }

    /**
     * @dev Removes a value from a set. O(1).
     *
     * Returns true if the value was removed from the set, that is if it was
     * present.
     */
    function remove(UintSet storage set, uint256 value) internal returns (bool) {
        return _remove(set._inner, bytes32(value));
    }

    /**
     * @dev Returns true if the value is in the set. O(1).
     */
    function contains(UintSet storage set, uint256 value) internal view returns (bool) {
        return _contains(set._inner, bytes32(value));
    }

    /**
     * @dev Returns the number of values on the set. O(1).
     */
    function length(UintSet storage set) internal view returns (uint256) {
        return _length(set._inner);
    }

   /**
    * @dev Returns the value stored at position `index` in the set. O(1).
    *
    * Note that there are no guarantees on the ordering of values inside the
    * array, and it may change when more values are added or removed.
    *
    * Requirements:
    *
    * - `index` must be strictly less than {length}.
    */
    function at(UintSet storage set, uint256 index) internal view returns (uint256) {
        return uint256(_at(set._inner, index));
    }
}


// File contracts/ICountryList.sol



/**
 * @dev Interface of the CountryList contract
 */
interface ICountryList {
  function countryIsValid (uint16 _countryCode) external view returns (bool);
}


// File contracts/ReentrancyGuard.sol

// File @openzeppelin/contracts/security/ReentrancyGuard.sol@v4.0.0



/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot"s contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler"s defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction"s gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor () {
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and make it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        // On the first call to nonReentrant, _notEntered will be true
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;

        _;

        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }
}


// File contracts/TransferHelper.sol



// helper methods for interacting with ERC20 tokens that do not consistently return true/false
library TransferHelper {
    function safeApprove(address token, address to, uint value) internal {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x095ea7b3, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "TransferHelper: APPROVE_FAILED");
    }

    function safeTransfer(address token, address to, uint value) internal {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0xa9059cbb, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "TransferHelper: TRANSFER_FAILED");
    }

    function safeTransferFrom(address token, address from, address to, uint value) internal {
        (bool success, bytes memory data) = token.call(abi.encodeWithSelector(0x23b872dd, from, to, value));
        require(success && (data.length == 0 || abi.decode(data, (bool))), "TransferHelper: TRANSFER_FROM_FAILED");
    }

}


// File contracts/UniswapV2Locker.sol
// ALL RIGHTS RESERVED
// Unicrypt by SDDTech reserves all rights on this code. You may NOT copy these contracts.

// This contract locks liquidity tokens. Used to give investors peace of mind a token team has locked liquidity
// and that the liquidity tokens cannot be removed from the AMM until the specified unlock date has been reached. This is one of many
// important industry standards to ensure safety.







interface IUniswapV2Pair {
    function factory() external view returns (address);
    function token0() external view returns (address);
    function token1() external view returns (address);
}

interface IERCBurn {
    function burn(uint256 _amount) external;
    function approve(address spender, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external returns (uint256);
    function balanceOf(address account) external view returns (uint256);
}

interface IUniFactory {
    function getPair(address tokenA, address tokenB) external view returns (address);
}

interface IMigrator {
    function migrate(address lpToken, uint256 amount, uint256 unlockDate, address owner, uint16 countryCode, uint256 option) external returns (bool);
}

contract UniswapV2Locker is Ownable, ReentrancyGuard {
  using EnumerableSet for EnumerableSet.AddressSet;
  using EnumerableSet for EnumerableSet.UintSet;

  IUniFactory public uniswapFactory;

  struct UserInfo {
    EnumerableSet.AddressSet lockedTokens; // records all unique tokens the user has locked
    mapping(address => EnumerableSet.UintSet) locksForToken; // map erc20 address to lock id list for that user / token.
  }

  struct TokenLock {
    address lpToken; // The LP token
    uint256 lockDate; // the date the token was locked
    uint256 amount; // the amount of tokens still locked (initialAmount minus withdrawls)
    uint256 initialAmount; // the initial lock amount
    uint256 unlockDate; // the date the token can be withdrawn
    uint256 lockID; // lockID nonce per uni pair
    address owner; // who can withdraw the lock
    uint16 countryCode; // the country code of the locker / business
  }

  mapping(address => UserInfo) private USERS; // Get lock user info

  mapping(uint256 => TokenLock) public LOCKS; // ALL locks are registered here in chronological lock id order.
  uint256 public NONCE = 0; // incremental lock nonce counter, this is the unique ID for the next lock

  EnumerableSet.AddressSet private lockedTokens; // a list of all unique locked liquidity tokens
  mapping(address => uint256[]) public TOKEN_LOCKS; // map univ2 pair to an array of all its lock ids
  
  struct FeeStruct {
    uint256 ethFee; // Small eth fee to prevent spam on the platform
    IERCBurn secondaryFeeToken; // UNCX or UNCL
    uint256 secondaryTokenFee; // optional, UNCX or UNCL
    uint256 secondaryTokenDiscount; // discount on liquidity fee for burning secondaryToken
    uint256 liquidityFee; // fee on univ2 liquidity tokens
    uint256 referralPercent; // fee for referrals
    IERCBurn referralToken; // token the refferer must hold to qualify as a referrer
    uint256 referralHold; // balance the referrer must hold to qualify as a referrer
    uint256 referralDiscount; // discount on flatrate fees for using a valid referral address
  }
    
  FeeStruct public gFees;
  EnumerableSet.AddressSet private feeWhitelist;
  
  address payable devaddr;
  
  IMigrator public migrator; // migration contract
  ICountryList public COUNTRY_LIST;

  event onNewLock(uint256 lockID, address lpToken, address owner, uint256 amount, uint256 lockDate, uint256 unlockDate, uint16 countryCode);
  event onRelock(uint256 lockID, address lpToken, address owner, uint256 amountRemainingInLock, uint256 liquidityFee, uint256 unlockDate);
  event onWithdraw(uint256 lockID, address lpToken, address owner, uint256 amountRemainingInLock, uint256 amountRemoved);
  event onIncrementLock(uint256 lockID, address lpToken, address owner, address payer, uint256 amountRemainingInLock, uint256 amountAdded, uint256 liquidityFee);
  event onSplitLock(uint256 lockID, address lpToken, address owner, uint256 amountRemainingInLock, uint256 amountRemoved);
  event onTransferLockOwnership(uint256 lockID, address lpToken, address oldOwner, address newOwner);
  event OnMigrate(uint256 lockID, address lpToken, address owner, uint256 amountRemainingInLock, uint256 amountMigrated, uint256 migrationOption);

  constructor(IUniFactory _uniswapFactory, ICountryList _countryList) {
    devaddr = payable(msg.sender);
    gFees.referralPercent = 250; // 25%
    gFees.ethFee = 1e18;
    gFees.secondaryTokenFee = 100e18;
    gFees.secondaryTokenDiscount = 200; // 20%
    gFees.liquidityFee = 10; // 1%
    gFees.referralHold = 10e18;
    gFees.referralDiscount = 100; // 10%
    uniswapFactory = _uniswapFactory;
    COUNTRY_LIST = _countryList;
  }
  
  function setDev(address payable _devaddr) public onlyOwner {
    devaddr = _devaddr;
  }
  
  /**
   * @notice set the migrator contract which allows locked lp tokens to be migrated to future AMM versions
   */
  function setMigrator(IMigrator _migrator) public onlyOwner {
    migrator = _migrator;
  }
  
  function setSecondaryFeeToken(address _secondaryFeeToken) public onlyOwner {
    gFees.secondaryFeeToken = IERCBurn(_secondaryFeeToken);
  }
  
  /**
   * @notice referrers need to hold the specified token and hold amount to be elegible for referral fees
   */
  function setReferralTokenAndHold(IERCBurn _referralToken, uint256 _hold) public onlyOwner {
    gFees.referralToken = _referralToken;
    gFees.referralHold = _hold;
  }
  
  function setFees(uint256 _referralPercent, uint256 _referralDiscount, uint256 _ethFee, uint256 _secondaryTokenFee, uint256 _secondaryTokenDiscount, uint256 _liquidityFee) public onlyOwner {
    gFees.referralPercent = _referralPercent;
    gFees.referralDiscount = _referralDiscount;
    gFees.ethFee = _ethFee;
    gFees.secondaryTokenFee = _secondaryTokenFee;
    gFees.secondaryTokenDiscount = _secondaryTokenDiscount;
    gFees.liquidityFee = _liquidityFee;
  }
  
  /**
   * @notice whitelisted accounts dont pay flatrate fees on locking
   */
  function whitelistFeeAccount(address _user, bool _add) public onlyOwner {
    if (_add) {
      feeWhitelist.add(_user);
    } else {
      feeWhitelist.remove(_user);
    }
  }

  /**
   * @notice Creates a new lock
   * @param _lpToken the univ2 token address
   * @param _amount amount of LP tokens to lock
   * @param _unlock_date the unix timestamp (in seconds) until unlock
   * @param _referral the referrer address if any or address(0) for none
   * @param _fee_in_eth fees can be paid in eth or in a secondary token such as UNCX with a discount on univ2 tokens
   * @param _withdrawer the user who can withdraw liquidity once the lock expires.
   * @param _countryCode the code of the country from which the lock user account / business is from
   */
  function lockLPToken (address _lpToken, uint256 _amount, uint256 _unlock_date, address payable _referral, bool _fee_in_eth, address payable _withdrawer, uint16 _countryCode) external payable nonReentrant {
    require(_unlock_date < 10000000000, "TIMESTAMP INVALID"); // prevents errors when timestamp entered in milliseconds
    require(_amount > 0, "INSUFFICIENT");
    require(COUNTRY_LIST.countryIsValid(_countryCode), "COUNTRY");

    // TODO re-enable this check
    // ensure this pair is a univ2 pair by querying the factory
    IUniswapV2Pair lpair = IUniswapV2Pair(address(_lpToken));
    address factoryPairAddress = uniswapFactory.getPair(lpair.token0(), lpair.token1());
    require(factoryPairAddress == address(_lpToken), "NOT UNIV2");

    TransferHelper.safeTransferFrom(_lpToken, address(msg.sender), address(this), _amount);
    
    if (_referral != address(0) && address(gFees.referralToken) != address(0)) {
      require(gFees.referralToken.balanceOf(_referral) >= gFees.referralHold, "INADEQUATE BALANCE");
    }
    
    // flatrate fees
    if (!feeWhitelist.contains(msg.sender)) {
      if (_fee_in_eth) { // charge fee in eth
        uint256 ethFee = gFees.ethFee;
        if (_referral != address(0)) {
          ethFee = ethFee * (1000 - gFees.referralDiscount) / 1000;
        }
        require(msg.value == ethFee, "FEE NOT MET");
        uint256 devFee = ethFee;
        if (ethFee != 0 && _referral != address(0)) { // referral fee
          uint256 referralFee = devFee * gFees.referralPercent / 1000;
          _referral.transfer(referralFee);
          devFee -= referralFee;
        }
        devaddr.transfer(devFee);
      } else { // charge fee in token
        uint256 burnFee = gFees.secondaryTokenFee;
        if (_referral != address(0)) {
          burnFee = burnFee * (1000 - gFees.referralDiscount) / 1000;
        }
        TransferHelper.safeTransferFrom(address(gFees.secondaryFeeToken), address(msg.sender), address(this), burnFee);
        if (gFees.referralPercent != 0 && _referral != address(0)) { // referral fee
          uint256 referralFee = burnFee * gFees.referralPercent / 1000;
          TransferHelper.safeApprove(address(gFees.secondaryFeeToken), _referral, referralFee);
          TransferHelper.safeTransfer(address(gFees.secondaryFeeToken), _referral, referralFee);
          burnFee -= referralFee;
        }
        gFees.secondaryFeeToken.burn(burnFee);
      }
    } else if (msg.value > 0){
      // refund eth if a whitelisted member sent it by mistake
      payable(msg.sender).transfer(msg.value);
    }
    
    // percent fee
    uint256 liquidityFee = _amount * gFees.liquidityFee / 1000;
    if (!_fee_in_eth && !feeWhitelist.contains(msg.sender)) { // fee discount for large lockers using secondary token
      liquidityFee = liquidityFee * (1000 - gFees.secondaryTokenDiscount) / 1000;
    }
    TransferHelper.safeTransfer(_lpToken, devaddr, liquidityFee);
    uint256 amountLocked = _amount - liquidityFee;

    TokenLock memory token_lock;
    token_lock.lpToken = _lpToken;
    token_lock.lockDate = block.timestamp;
    token_lock.amount = amountLocked;
    token_lock.initialAmount = amountLocked;
    token_lock.unlockDate = _unlock_date;
    token_lock.lockID = NONCE;
    token_lock.owner = _withdrawer;
    token_lock.countryCode = _countryCode;

    // record the lock for the univ2pair
    LOCKS[NONCE] = token_lock;
    lockedTokens.add(_lpToken);
    TOKEN_LOCKS[_lpToken].push(NONCE);

    // record the lock for the user
    UserInfo storage user = USERS[_withdrawer];
    user.lockedTokens.add(_lpToken);
    EnumerableSet.UintSet storage user_locks = user.locksForToken[_lpToken];
    user_locks.add(token_lock.lockID);

    NONCE ++;
    
    emit onNewLock(token_lock.lockID, _lpToken, _withdrawer, token_lock.amount, token_lock.lockDate, token_lock.unlockDate, token_lock.countryCode);
  }
  
  /**
   * @notice extend a lock with a new unlock date
   */
  function relock (uint256 _lockID, uint256 _unlock_date) external nonReentrant {
    require(_unlock_date < 10000000000, "TIMESTAMP INVALID"); // prevents errors when timestamp entered in milliseconds
    TokenLock storage userLock = LOCKS[_lockID];
    require(userLock.owner == msg.sender, "NOT OWNER");
    require(userLock.unlockDate < _unlock_date, "UNLOCK BEFORE");
    
    uint256 liquidityFee = userLock.amount * gFees.liquidityFee / 1000;
    uint256 amountLocked = userLock.amount - liquidityFee;
    
    userLock.amount = amountLocked;
    userLock.unlockDate = _unlock_date;

    // send univ2 fee to dev address
    TransferHelper.safeTransfer(userLock.lpToken, devaddr, liquidityFee);
    emit onRelock(userLock.lockID, userLock.lpToken, msg.sender, userLock.amount, liquidityFee, userLock.unlockDate);
  }
  
  /**
   * @notice withdraw a specified amount from a lock
   */
  function withdraw (uint256 _lockID, uint256 _amount) external nonReentrant {
    require(_amount > 0, "ZERO WITHDRAWL");
    TokenLock storage userLock = LOCKS[_lockID];
    require(userLock.owner == msg.sender, "NOT OWNER");
    require(userLock.unlockDate < block.timestamp, "NOT YET");
    userLock.amount -= _amount;

    // clean user storage
    if (userLock.amount == 0) {
      EnumerableSet.UintSet storage userLocks = USERS[msg.sender].locksForToken[userLock.lpToken];
      userLocks.remove(userLock.lockID);
      if (userLocks.length() == 0) {
        USERS[msg.sender].lockedTokens.remove(userLock.lpToken);
      }
    }
    
    TransferHelper.safeTransfer(userLock.lpToken, msg.sender, _amount);
    emit onWithdraw(userLock.lockID, userLock.lpToken, msg.sender, userLock.amount, _amount);
  }
  
  /**
   * @notice PLEASE BE AWARE THIS FUNCTION CONTAINS NO OWNER CHECK. ANYONE CAN LOCK THEIR LPS INTO SOMEONE ELSES
   * LOCK, BASICALLY GIVING THEM THEIR LP TOKENS.
   * The use here is a CONTRACT which is not the owner of a lock can increment locks periodically (for example with fees) on behalf of the owner.
   * This works well with taxing tokens.
   *
   * Increase the amount of tokens per a specific lock, this is preferable to creating a new lock,
   * less fees, and faster loading on our live block explorer.
   */
  function incrementLock (uint256 _lockID, uint256 _amount) external nonReentrant {
    require(_amount > 0, "ZERO AMOUNT");
    TokenLock storage userLock = LOCKS[_lockID];
    // require(userLock.owner == msg.sender, "NOT OWNER"); // disabled to allow contracts to lock on behalf of owners
    
    TransferHelper.safeTransferFrom(userLock.lpToken, address(msg.sender), address(this), _amount);
    
    // send univ2 fee to dev address
    uint256 liquidityFee = _amount * gFees.liquidityFee / 1000;
    TransferHelper.safeTransfer(userLock.lpToken, devaddr, liquidityFee);
    uint256 amountLocked = _amount - liquidityFee;
    
    userLock.amount += amountLocked;
    
    emit onIncrementLock(userLock.lockID, userLock.lpToken, userLock.owner, msg.sender, userLock.amount, amountLocked, liquidityFee);
  }
  
  /**
   * @notice split a lock into two seperate locks, useful when a lock is about to expire and youd like to relock a portion
   * and withdraw a smaller portion
   */
  function splitLock (uint256 _lockID, uint256 _amount) external payable nonReentrant {
    require(_amount > 0, "ZERO AMOUNT");
    TokenLock storage userLock = LOCKS[_lockID];
    require(userLock.owner == msg.sender, "NOT OWNER");
    
    require(msg.value == gFees.ethFee, "FEE NOT MET");
    devaddr.transfer(gFees.ethFee);
    
    userLock.amount -= _amount;
    
    TokenLock memory token_lock;
    token_lock.lpToken = userLock.lpToken;
    token_lock.lockDate = userLock.lockDate;
    token_lock.amount = _amount;
    token_lock.initialAmount = _amount;
    token_lock.unlockDate = userLock.unlockDate;
    token_lock.lockID = NONCE;
    token_lock.owner = msg.sender;
    token_lock.countryCode = userLock.countryCode;

    // record the lock for the univ2pair
    TOKEN_LOCKS[userLock.lpToken].push(NONCE);
    LOCKS[NONCE] = token_lock;

    // record the lock for the user
    UserInfo storage user = USERS[msg.sender];
    EnumerableSet.UintSet storage user_locks = user.locksForToken[userLock.lpToken];
    user_locks.add(NONCE);
    NONCE ++;
    emit onSplitLock(userLock.lockID, userLock.lpToken, msg.sender, userLock.amount, _amount);
    emit onNewLock(token_lock.lockID, token_lock.lpToken, msg.sender, token_lock.amount, token_lock.lockDate, token_lock.unlockDate, token_lock.countryCode);
  }
  
  /**
   * @notice transfer a lock to a new owner, e.g. presale project -> project owner
   */
  function transferLockOwnership (uint256 _lockID, address payable _newOwner) external {
    require(msg.sender != _newOwner, "OWNER");
    TokenLock storage transferredLock = LOCKS[_lockID];
    require(transferredLock.owner == msg.sender, "NOT OWNER");
    
    // record the lock for the new Owner
    UserInfo storage user = USERS[_newOwner];
    user.lockedTokens.add(transferredLock.lpToken);
    EnumerableSet.UintSet storage user_locks = user.locksForToken[transferredLock.lpToken];
    user_locks.add(transferredLock.lockID);

    // remove the lock from the old owner
    EnumerableSet.UintSet storage userLocks = USERS[msg.sender].locksForToken[transferredLock.lpToken];
    userLocks.remove(transferredLock.lockID);
    if (userLocks.length() == 0) {
      USERS[msg.sender].lockedTokens.remove(transferredLock.lpToken);
    }
    
    transferredLock.owner = _newOwner;
    emit onTransferLockOwnership(_lockID, transferredLock.lpToken, msg.sender, _newOwner);
  }
  
  /**
   * @notice migrates liquidity to the next release of an AMM
   * @param _migration_option to be used as an AMM selector
   */
  function migrate (uint256 _lockID, uint256 _amount, uint256 _migration_option) external nonReentrant {
    require(address(migrator) != address(0), "NOT SET");
    require(_amount > 0, "ZERO MIGRATION");
    
    TokenLock storage userLock = LOCKS[_lockID];
    require(userLock.owner == msg.sender, "NOT OWNER");
    userLock.amount -= _amount;

    // clean user storage
    if (userLock.amount == 0) {
      EnumerableSet.UintSet storage userLocks = USERS[msg.sender].locksForToken[userLock.lpToken];
      userLocks.remove(userLock.lockID);
      if (userLocks.length() == 0) {
        USERS[msg.sender].lockedTokens.remove(userLock.lpToken);
      }
    }
    
    TransferHelper.safeApprove(userLock.lpToken, address(migrator), _amount);
    migrator.migrate(userLock.lpToken, _amount, userLock.unlockDate, msg.sender, userLock.countryCode, _migration_option);
    emit OnMigrate(_lockID, userLock.lpToken, msg.sender, userLock.amount, _amount, _migration_option);
  }
  
  function getNumLocksForToken (address _lpToken) external view returns (uint256) {
    return TOKEN_LOCKS[_lpToken].length;
  }
  
  function getNumLockedTokens () external view returns (uint256) {
    return lockedTokens.length();
  }
  
  function getLockedTokenAtIndex (uint256 _index) external view returns (address) {
    return lockedTokens.at(_index);
  }
  
  // user functions
  function getUserNumLockedTokens (address _user) external view returns (uint256) {
    UserInfo storage user = USERS[_user];
    return user.lockedTokens.length();
  }
  
  function getUserLockedTokenAtIndex (address _user, uint256 _index) external view returns (address) {
    UserInfo storage user = USERS[_user];
    return user.lockedTokens.at(_index);
  }
  
  function getUserNumLocksForToken (address _user, address _lpToken) external view returns (uint256) {
    UserInfo storage user = USERS[_user];
    return user.locksForToken[_lpToken].length();
  }
  
  function getUserLockForTokenAtIndex (address _user, address _lpToken, uint256 _index) external view 
  returns (TokenLock memory) {
    uint256 lockID = USERS[_user].locksForToken[_lpToken].at(_index);
    TokenLock storage tokenLock = LOCKS[lockID];
    return tokenLock;
  }
  
  // whitelist
  function getWhitelistedUsersLength () external view returns (uint256) {
    return feeWhitelist.length();
  }
  
  function getWhitelistedUserAtIndex (uint256 _index) external view returns (address) {
    return feeWhitelist.at(_index);
  }
  
  function getUserWhitelistStatus (address _user) external view returns (bool) {
    return feeWhitelist.contains(_user);
  }
}
