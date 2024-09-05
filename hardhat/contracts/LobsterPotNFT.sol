// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title LobsterPot NFT Contract
/// @notice This contract manages the minting and metadata of LobsterPot NFTs
contract LobsterPotNFT is ERC721, Ownable, ReentrancyGuard {
    uint256 private _nextTokenId;
    uint256 public constant MINT_PRICE = 0.001 ether;
    address public developmentWallet;
    string public imageURI;

    event DevelopmentWalletUpdated(
        address indexed oldWallet,
        address indexed newWallet
    );
    event ImageURIUpdated(string oldURI, string newURI);

    /// @notice Initializes the LobsterPot NFT contract
    /// @param _developmentWallet Address of the wallet to receive mint proceeds
    /// @param _imageURI URI for the NFT image
    constructor(
        address _developmentWallet,
        string memory _imageURI
    ) ERC721("LobsterPot", "LPOT") Ownable(msg.sender) {
        require(_developmentWallet != address(0), "Invalid development wallet");
        developmentWallet = _developmentWallet;
        imageURI = _imageURI;
    }

    /// @notice Mints a new LobsterPot NFT
    /// @dev Requires payment of MINT_PRICE
    function mintLobsterPot() public payable nonReentrant {
        require(msg.value == MINT_PRICE, "Incorrect ETH amount sent");
        uint256 tokenId = _nextTokenId++;
        _safeMint(msg.sender, tokenId);
    }

    /// @notice Updates the development wallet address
    /// @param newDevelopmentWallet New address for the development wallet
    function setDevelopmentWallet(
        address newDevelopmentWallet
    ) public onlyOwner {
        require(
            newDevelopmentWallet != address(0),
            "Invalid development wallet"
        );
        address oldWallet = developmentWallet;
        developmentWallet = newDevelopmentWallet;
        emit DevelopmentWalletUpdated(oldWallet, newDevelopmentWallet);
    }

    /// @notice Updates the image URI for all NFTs
    /// @param newImageURI New URI for the NFT image
    function setImageURI(string memory newImageURI) public onlyOwner {
        string memory oldURI = imageURI;
        imageURI = newImageURI;
        emit ImageURIUpdated(oldURI, newImageURI);
    }

    /// @notice Withdraws the contract's balance to the development wallet
    function withdrawFunds() public nonReentrant {
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
