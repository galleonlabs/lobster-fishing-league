// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./ILobsterToken.sol";

interface IFishingSpot {
    function fish() external;
    function baitArea(uint256 _amount) external;
    
    function equipmentNFT() external view returns (IERC721);
    function lobsterToken() external view returns (ILobsterToken);
    function lobsterAmount() external view returns (uint256);
    function lastFishingTime(address fisher) external view returns (uint256);

    event FishingSpotCreated(address indexed equipmentNFT, address indexed lobsterToken, uint256 lobsterAmount);
    event SuccessfulFishing(address indexed fisher, uint256 amount);
    event AreaBaited(uint256 amount);
}