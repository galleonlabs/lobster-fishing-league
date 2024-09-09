// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IEquipmentNFT is IERC721 {
    function mintEquipment() external payable;
    function setDevelopmentWallet(address newDevelopmentWallet) external;
    function setImageURI(string memory newImageURI) external;
    function withdrawFunds() external;
    
    function MINT_PRICE() external view returns (uint256);
    function developmentWallet() external view returns (address);
    function imageURI() external view returns (string memory);

    event DevelopmentWalletUpdated(address indexed oldWallet, address indexed newWallet);
    event ImageURIUpdated(string oldURI, string newURI);
}