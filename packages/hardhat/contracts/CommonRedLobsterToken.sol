// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CommonRedLobsterToken is ERC20, Ownable {
	mapping(address => bool) private _whitelistedPools;

	event PoolWhitelisted(address indexed pool);
	event PoolUnwhitelisted(address indexed pool);
	event LobstersMinted(address indexed pool, uint256 amount);

	constructor() ERC20("CommonRedLobster", "CRL") {}

	function whitelistPool(address _pool) public onlyOwner {
		require(_pool != address(0), "Invalid pool address");
		require(!_whitelistedPools[_pool], "Pool already whitelisted");
		_whitelistedPools[_pool] = true;
		emit PoolWhitelisted(_pool);
	}

	function unwhitelistPool(address _pool) public onlyOwner {
		require(_whitelistedPools[_pool], "Pool is not whitelisted");
		_whitelistedPools[_pool] = false;
		emit PoolUnwhitelisted(_pool);
	}

	function mintLobstersToPool(uint256 _amount) public {
		require(
			_whitelistedPools[msg.sender],
			"Sender is not a whitelisted pool"
		);
		require(_amount > 0, "Amount must be greater than zero");
		_mint(msg.sender, _amount);
		emit LobstersMinted(msg.sender, _amount);
	}

	function isPoolWhitelisted(address _pool) public view returns (bool) {
		return _whitelistedPools[_pool];
	}
}
