// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MockERC721 is ERC721 {
    uint256 private _tokenIdCounter;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function mint(address to) public {
        _safeMint(to, _tokenIdCounter);
        _tokenIdCounter++;
    }

    function burn(uint256 tokenId) public {
        _burn(tokenId);
    }
}