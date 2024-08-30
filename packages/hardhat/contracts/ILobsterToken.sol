// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ILobsterToken is IERC20 {
	function whitelistPool(address _pool) external;

	function unwhitelistPool(address _pool) external;

	function mintLobstersToPool(address _pool, uint256 _amount) external;
}
