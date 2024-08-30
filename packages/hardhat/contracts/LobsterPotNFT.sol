// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract LobsterPotNFT is ERC721, Ownable {
	uint256 public tokenCounter;
	uint256 public constant MINT_PRICE = 0.001 ether;
	address public developmentWallet;
	string public imageURI;

	constructor(
		address _developmentWallet,
		string memory _imageURI
	) ERC721("LobsterPot", "LPOT") {
		tokenCounter = 0;
		developmentWallet = _developmentWallet;
		imageURI = _imageURI;
	}

	function mintLobsterPot() public payable {
		require(msg.value == MINT_PRICE, "Incorrect ETH amount sent");
		payable(developmentWallet).transfer(msg.value);
		_safeMint(msg.sender, tokenCounter);
		tokenCounter += 1;
	}

	function setDevelopmentTeamWallet(
		address _newDevelopmentWallet
	) public onlyOwner {
		developmentWallet = _newDevelopmentWallet;
	}

	function setImageURI(string memory _newImageURI) public onlyOwner {
		imageURI = _newImageURI;
	}
}
