// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./IEquipmentNFT.sol";

contract LobsterPotNFT is IEquipmentNFT, ERC721, Ownable, ReentrancyGuard {
    uint256 private _nextTokenId;
    uint256 public constant override MINT_PRICE = 0.001 ether;
    address public override developmentWallet;
    string public override imageURI;

    constructor(
        address _developmentWallet,
        string memory _imageURI
    ) ERC721("LobsterPot", "LPOT") Ownable(msg.sender) {
        require(_developmentWallet != address(0), "Invalid development wallet");
        developmentWallet = _developmentWallet;
        imageURI = _imageURI;
    }

    function mintEquipment() public payable override nonReentrant {
        require(msg.value == MINT_PRICE, "Incorrect ETH amount sent");
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
    }

    function setDevelopmentWallet(
        address newDevelopmentWallet
    ) public override onlyOwner {
        require(
            newDevelopmentWallet != address(0),
            "Invalid development wallet"
        );
        address oldWallet = developmentWallet;
        developmentWallet = newDevelopmentWallet;
        emit DevelopmentWalletUpdated(oldWallet, newDevelopmentWallet);
    }

    function setImageURI(string memory newImageURI) public override onlyOwner {
        string memory oldURI = imageURI;
        imageURI = newImageURI;
        emit ImageURIUpdated(oldURI, newImageURI);
    }

    function withdrawFunds() public override nonReentrant {
        require(
            msg.sender == developmentWallet,
            "Only development wallet can withdraw funds"
        );
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        (bool success, ) = payable(developmentWallet).call{value: balance}("");
        require(success, "Withdrawal failed");
    }
}