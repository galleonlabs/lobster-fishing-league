// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract LobsterPotNFT is ERC721, Ownable {
	using Counters for Counters.Counter;

	Counters.Counter private _tokenIds;
	uint256 public constant MINT_PRICE = 0.001 ether;
	address public developmentWallet;
	string public imageURI;

	event LobsterPotMinted(address indexed to, uint256 indexed tokenId);
	event DevelopmentWalletUpdated(
		address indexed oldWallet,
		address indexed newWallet
	);
	event ImageURIUpdated(string oldURI, string newURI);
	event FundsWithdrawn(address indexed to, uint256 amount);

	constructor(
		address _developmentWallet,
		string memory _imageURI
	) ERC721("LobsterPot", "LPOT") {
		require(_developmentWallet != address(0), "Invalid development wallet");
		developmentWallet = _developmentWallet;
		imageURI = _imageURI;
	}

	function mintLobsterPot() public payable {
		require(msg.value == MINT_PRICE, "Incorrect ETH amount sent");

		uint256 newTokenId = _tokenIds.current();
		_tokenIds.increment();

		_safeMint(msg.sender, newTokenId);

		emit LobsterPotMinted(msg.sender, newTokenId);
	}

	function setDevelopmentWallet(
		address _newDevelopmentWallet
	) public onlyOwner {
		require(
			_newDevelopmentWallet != address(0),
			"Invalid development wallet"
		);
		address oldWallet = developmentWallet;
		developmentWallet = _newDevelopmentWallet;
		emit DevelopmentWalletUpdated(oldWallet, _newDevelopmentWallet);
	}

	function setImageURI(string memory _newImageURI) public onlyOwner {
		string memory oldURI = imageURI;
		imageURI = _newImageURI;
		emit ImageURIUpdated(oldURI, _newImageURI);
	}

	function tokenURI(
		uint256 tokenId
	) public view virtual override returns (string memory) {
		require(
			_exists(tokenId),
			"ERC721Metadata: URI query for nonexistent token"
		);
		return imageURI;
	}

	function withdrawFunds() public {
		require(
			msg.sender == developmentWallet,
			"Only development wallet can withdraw funds"
		);
		uint256 balance = address(this).balance;
		require(balance > 0, "No funds to withdraw");
		(bool success, ) = payable(developmentWallet).call{ value: balance }(
			""
		);
		require(success, "Withdrawal failed");
		emit FundsWithdrawn(developmentWallet, balance);
	}
}
