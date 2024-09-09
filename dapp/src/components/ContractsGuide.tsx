import React, { useState } from "react";
import { FaChevronDown, FaCoins, FaBox, FaFish } from "react-icons/fa";

type ContractsGuideProps = {
  contractAddresses: {
    lobsterPotNFT: `0x${string}`;
    commonRedLobsterToken: `0x${string}`;
    fishingSpot: `0x${string}`;
  };
};

export default function ContractsGuide({ contractAddresses }: ContractsGuideProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleExpand = (contractName: string) => {
    setExpanded(expanded === contractName ? null : contractName);
  };

  const ContractSection = ({
    name,
    address,
    description,
    code,
    icon,
  }: {
    name: string;
    address: string;
    description: string;
    code: string;
    icon: React.ReactNode;
  }) => (
    <div className="mb-6 bg-white border border-text rounded-lg overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105">
      <div
        className="flex justify-between items-center text-xl font-semibold mb-2 text-text  cursor-pointer hover:bg-primary p-4"
        onClick={() => toggleExpand(name)}
      >
        <div className="flex items-center grayscale">
          {icon}
          <h4 className="ml-4">{name}</h4>
        </div>
        <FaChevronDown className={`transform transition-transform ${expanded === name ? "rotate-180" : ""}`} />
      </div>
      {expanded === name && (
        <div className="p-4 bg-white text-text-light">
          <p className="mb-2">
            Address:{" "}
            <a
              className="break-all text-primary-dark hover:text-primary underline"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://basescan.org/address/${address}`}
            >
              {address}
            </a>
          </p>
          <p className="mb-4">{description}</p>
          <div className="bg-neutral-light p-4 rounded-md overflow-x-auto">
            <pre className="text-sm text-text whitespace-pre-wrap">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section className="bg-white rounded-xl shadow-md p-6 mb-8 text-text">
      <h3 className="text-2xl font-bold mb-4 text-primary-dark">Contracts Guide</h3>
      <p className="mb-6 text-text-light">Learn how to interact with our smart contracts and build on top of them:</p>

      <ContractSection
        name="CommonRedLobsterToken.sol"
        address={contractAddresses.commonRedLobsterToken}
        description="This ERC20 token represents caught lobsters that can be freely transferred and used onchain as a composable token. New Lobster types can be created by implementing ILobsterToken.sol."
        code={`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract CommonRedLobsterToken is ERC20, Ownable, ReentrancyGuard {
    mapping(address => bool) private _whitelistedPools;

    event PoolWhitelisted(address indexed pool);
    event PoolUnwhitelisted(address indexed pool);
    event LobstersMinted(address indexed pool, uint256 amount);

    constructor() ERC20("CommonRedLobster", "CRL") Ownable(msg.sender) {}

    function whitelistPool(address _pool) public onlyOwner {
        require(_pool != address(0), "Invalid pool address");
        require(!_whitelistedPools[_pool], "Pool already whitelisted");
        _whitelistedPools[_pool] = true;
        emit PoolWhitelisted(_pool);
    }

    function unwhitelistPool(address _pool) public onlyOwner {
        require(_whitelistedPools[_pool], "Pool is not whitelisted");
        _whitelistedPools[_pool] = false;
        emit PoolUnwhitelisted(_pool);
    }

    function mintLobstersToPool(uint256 _amount) public nonReentrant {
        require(
            _whitelistedPools[msg.sender],
            "Sender is not a whitelisted pool"
        );
        require(_amount > 0, "Amount must be greater than zero");
        _mint(msg.sender, _amount);
        emit LobstersMinted(msg.sender, _amount);
    }

    function isPoolWhitelisted(address _pool) public view returns (bool) {
        return _whitelistedPools[_pool];
    }
}
`}
        icon={<FaCoins className="text-secondary-dark" />}
      />

      <ContractSection
        name="LobsterPotNFT.sol"
        address={contractAddresses.lobsterPotNFT}
        description="This contract implements the IEquipmentNFT.sol interface, allowing for future equipment types to be created that enable higher rarity lobster fishing."
        code={`// SPDX-License-Identifier: MIT
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
}`}
        icon={<FaBox className="text-primary-dark" />}
      />

      <ContractSection
        name="FishingSpot.sol"
        address={contractAddresses.fishingSpot}
        description="This contract implements fishing mechanics. Fishing Pools have a finite amount of lobsters in them to fish and can vary in rarity. New pools can be created by implementing IFishingSpot.sol."
        code={`// SPDX-License-Identifier: MIT
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
}`}
        icon={<FaFish className="text-secondary" />}
      />

      <p className="text-text-light mt-6">
        Developers can create new equipment types, lobster tokens, or fishing spots by implementing the respective
        interfaces and integrating with these base contracts. We will whitelist new pools so they can be baited with
        lobsters for all to enjoy!
      </p>
    </section>
  );
}
