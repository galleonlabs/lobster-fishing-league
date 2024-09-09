import React, { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

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
  }: {
    name: string;
    address: string;
    description: string;
    code: string;
  }) => (
    <div className="mb-6">
      <div
        className="flex justify-between items-center text-xl font-semibold mb-2 text-primary-dark cursor-pointer hover:bg-gray-100 p-2 rounded shadow-md px-4 py-2"
        onClick={() => toggleExpand(name)}
      >
        <h4>{name}</h4>
        <FaChevronDown className={`transform transition-transform ${expanded === name ? "rotate-180" : ""}`} />
      </div>
      {expanded === name && (
        <div className="mt-4 space-y-4">
          <p className="text-text-light">
            Address:{" "}
            <a
              className="break-all hover:text-primary-dark underline"
              target="_blank"
              rel="noopener noreferrer"
              href={`https://basescan.org/address/${address}`}
            >
              {address}
            </a>
          </p>
          <p className="text-text-light">{description}</p>
          <div className="bg-neutral-light p-4 rounded-md overflow-x-auto">
            <pre className="text-sm whitespace-pre-wrap">
              <code>{code}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <section className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:p-8">
      <h3 className="text-2xl font-bold mb-4 text-primary-dark">Contracts Guide</h3>
      <p className="mb-6 text-text-light">Learn how to interact with our smart contracts and build on top of them:</p>

      <ContractSection
        name="CommonRedLobsterToken.sol"
        address={contractAddresses.commonRedLobsterToken}
        description="This ERC20 token represents caught lobsters that can be freely transferred and used onchain as a composable token. New Lobster types can be created by implementing ILobsterToken.sol."
        code={`function whitelistPool(address _pool) external
function unwhitelistPool(address _pool) external
function mintLobstersToPool(uint256 _amount) external
function isPoolWhitelisted(address _pool) public view returns (bool)`}
      />

      <ContractSection
        name="LobsterPotNFT.sol"
        address={contractAddresses.lobsterPotNFT}
        description="This contract implements the IEquipmentNFT.sol interface, allowing for future equipment types to be created that enable higher rarity lobster fishing."
        code={`function mintEquipment() public payable
function setDevelopmentWallet(address newDevelopmentWallet) external
function setImageURI(string memory newImageURI) external
function withdrawFunds() external
function MINT_PRICE() public view returns (uint256)
function developmentWallet() public view returns (address)
function imageURI() public view returns (string memory)`}
      />

      <ContractSection
        name="FishingSpot.sol"
        address={contractAddresses.fishingSpot}
        description="This contract implements fishing mechanics. Fishing Pools have a finite amount of lobsters in them to fish and can vary in rarity. New pools can be created by implementing IFishingSpot.sol."
        code={`function fish() external
function baitArea(uint256 _amount) external
function equipmentNFT() public view returns (IERC721)
function lobsterToken() public view returns (ILobsterToken)
function lobsterAmount() public view returns (uint256)
function lastFishingTime(address fisher) public view returns (uint256)`}
      />

      <p className="text-text-light mt-6">
        Developers can create new equipment types, lobster tokens, or fishing spots by implementing the respective
        interfaces and integrating with these base contracts. We will whitelist new pools so they can be baited with
        lobsters for all to enjoy!
      </p>
    </section>
  );
}
