// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./IFishingSpot.sol";
import "./IEquipmentNFT.sol";
import "./ILobsterToken.sol";

contract FishingSpot is IFishingSpot, Ownable, ReentrancyGuard {
    IERC721 public override equipmentNFT;
    ILobsterToken public override lobsterToken;
    uint256 public override lobsterAmount;
    mapping(address => uint256) public override lastFishingTime;

    constructor(
        address _equipmentNFT,
        address _lobsterToken,
        uint256 _lobsterAmount
    ) Ownable(msg.sender) {
        equipmentNFT = IERC721(_equipmentNFT);
        lobsterToken = ILobsterToken(_lobsterToken);
        lobsterAmount = _lobsterAmount;
        lobsterToken.approve(address(this), type(uint256).max);
				
        emit FishingSpotCreated(_equipmentNFT, _lobsterToken, _lobsterAmount);
    }

    function fish() public override nonReentrant {
        require(
            equipmentNFT.balanceOf(msg.sender) > 0,
            "You need a Lobster Pot NFT to fish"
        );
        require(
            block.timestamp >= lastFishingTime[msg.sender] + 1 minutes,
            "Please wait for at least 1 minute before fishing again"
        );
        require(
            lobsterToken.balanceOf(address(this)) >= lobsterAmount,
            "Not enough lobster in the pool"
        );

        lobsterToken.transferFrom(address(this), msg.sender, lobsterAmount);
        lastFishingTime[msg.sender] = block.timestamp;

        emit SuccessfulFishing(msg.sender, lobsterAmount);
    }

    function baitArea(uint256 _amount) external override onlyOwner {
        lobsterToken.mintLobstersToPool(_amount);
        emit AreaBaited(_amount);
    }
}