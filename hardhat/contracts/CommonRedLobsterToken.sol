// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title Common Red Lobster Token Contract
/// @notice This contract manages the Common Red Lobster ERC20 token and whitelisted pools
contract CommonRedLobsterToken is ERC20, Ownable, ReentrancyGuard {
    mapping(address => bool) private _whitelistedPools;

    event PoolWhitelisted(address indexed pool);
    event PoolUnwhitelisted(address indexed pool);
    event LobstersMinted(address indexed pool, uint256 amount);

    /// @notice Initializes the Common Red Lobster token
    constructor() ERC20("CommonRedLobster", "CRL") Ownable(msg.sender) {}

    /// @notice Adds a pool to the whitelist
    /// @param _pool Address of the pool to whitelist
    function whitelistPool(address _pool) public onlyOwner {
        require(_pool != address(0), "Invalid pool address");
        require(!_whitelistedPools[_pool], "Pool already whitelisted");
        _whitelistedPools[_pool] = true;
        emit PoolWhitelisted(_pool);
    }

    /// @notice Removes a pool from the whitelist
    /// @param _pool Address of the pool to unwhitelist
    function unwhitelistPool(address _pool) public onlyOwner {
        require(_whitelistedPools[_pool], "Pool is not whitelisted");
        _whitelistedPools[_pool] = false;
        emit PoolUnwhitelisted(_pool);
    }

    /// @notice Mints new lobster tokens to a whitelisted pool
    /// @param _amount Amount of lobster tokens to mint
    function mintLobstersToPool(uint256 _amount) public nonReentrant {
        require(
            _whitelistedPools[msg.sender],
            "Sender is not a whitelisted pool"
        );
        require(_amount > 0, "Amount must be greater than zero");
        _mint(msg.sender, _amount);
        emit LobstersMinted(msg.sender, _amount);
    }

    /// @notice Checks if a pool is whitelisted
    /// @param _pool Address of the pool to check
    /// @return bool True if the pool is whitelisted, false otherwise
    function isPoolWhitelisted(address _pool) public view returns (bool) {
        return _whitelistedPools[_pool];
    }
}
