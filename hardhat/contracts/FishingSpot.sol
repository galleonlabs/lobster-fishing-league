// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./ILobsterToken.sol";

/// @title Fishing Spot Contract
/// @notice This contract manages a fishing spot where users can fish for lobsters
contract FishingSpot is Ownable, ReentrancyGuard {
    IERC721 public equipmentNFT;
    ILobsterToken public lobsterToken;
    uint256 public lobsterAmount;
    mapping(address => uint256) public lastFishingTime;

    event FishingSpotCreated(
        address indexed equipmentNFT,
        address indexed lobsterToken,
        uint256 lobsterAmount
    );
    event SuccessfulFishing(address indexed fisher, uint256 amount);
    event AreaBaited(uint256 amount);

    /// @notice Initializes the FishingSpot contract
    /// @param _equipmentNFT Address of the equipment NFT contract
    /// @param _lobsterToken Address of the lobster token contract
    /// @param _lobsterAmount Amount of lobsters to be rewarded per fishing
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

    /// @notice Allows users to fish for lobsters
    /// @dev Requires the user to have an equipment NFT and respects a cooldown period
    function fish() public nonReentrant {
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

    /// @notice Allows the owner to add more lobsters to the fishing spot
    /// @param _amount Amount of lobsters to add to the pool
    function baitArea(uint256 _amount) external onlyOwner {
        lobsterToken.mintLobstersToPool(_amount);
        emit AreaBaited(_amount);
    }
}
