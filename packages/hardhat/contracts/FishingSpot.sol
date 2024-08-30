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

		lobsterToken.transfer(msg.sender, lobsterAmount);
	}
}
