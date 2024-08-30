// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ILobsterToken.sol";

contract FishingSpot is Ownable {
	IERC721 public equipmentNFT;
	ILobsterToken public lobsterToken;
	uint256 public lobsterAmount;
	uint256 public endDate;
	mapping(address => uint256) public lastFishingTime;

	event FishingSpotCreated(
		address indexed equipmentNFT,
		address indexed lobsterToken,
		uint256 lobsterAmount,
		uint256 endDate
	);
	event SuccessfulFishing(address indexed fisher, uint256 amount);
	event AreaBaited(uint256 amount);

	constructor(
		address _equipmentNFT,
		address _lobsterToken,
		uint256 _lobsterAmount,
		uint256 _endDate
	) {
		equipmentNFT = IERC721(_equipmentNFT);
		lobsterToken = ILobsterToken(_lobsterToken);
		lobsterAmount = _lobsterAmount;
		endDate = _endDate;
		lobsterToken.approve(address(this), type(uint256).max);

		emit FishingSpotCreated(
			_equipmentNFT,
			_lobsterToken,
			_lobsterAmount,
			_endDate
		);
	}

	function fish() public {
		require(
			block.timestamp < endDate,
			"The lobster have migrated away from this spot"
		);

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

	function baitArea(uint256 _amount) external onlyOwner {
		lobsterToken.mintLobstersToPool(_amount);
		emit AreaBaited(_amount);
	}
}
