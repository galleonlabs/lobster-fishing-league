// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CommonRedLobsterToken is ERC20 {
	mapping(address => bool) private _whitelistedPools;

	constructor() ERC20("CommonRedLobster", "CRL") {}

	function whitelistPool(address _pool) public {
		_whitelistedPools[_pool] = true;
	}

	function unwhitelistPool(address _pool) public {
		_whitelistedPools[_pool] = false;
	}

	function mintLobstersToPool(address _pool, uint256 _amount) public {
		require(
			_whitelistedPools[msg.sender],
			"Only whitelisted pools can mint lobsters"
		);
		require(_whitelistedPools[_pool], "Pool is not whitelisted");
		_mint(_pool, _amount);
	}
}
