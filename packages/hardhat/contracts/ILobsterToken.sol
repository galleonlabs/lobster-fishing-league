// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface ILobsterToken is IERC20 {
    function whitelistPool(address _pool) external;
    function unwhitelistPool(address _pool) external;
    function mintLobstersToPool(uint256 _amount) external;
    function isPoolWhitelisted(address _pool) external view returns (bool);

    event PoolWhitelisted(address indexed pool);
    event PoolUnwhitelisted(address indexed pool);
    event LobstersMinted(address indexed pool, uint256 amount);
}