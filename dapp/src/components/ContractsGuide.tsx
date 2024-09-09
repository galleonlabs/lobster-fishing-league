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

  return (
    <section className="bg-white rounded-xl shadow-md p-8 mb-8">
      <h3 className="text-2xl font-bold mb-4 text-primary-dark">Contracts Guide</h3>
      <p className="mb-4 text-text-light">Learn how to interact with our smart contracts and build on top of them:</p>

      <div className="mb-6">
        <div
          className="flex justify-between items-center text-xl font-semibold mb-2 text-primary-dark cursor-pointer hover:bg-gray-100 p-2 rounded shadow-md px-4 py-2"
          onClick={() => toggleExpand("commonRedLobsterToken")}
        >
          <h4>CommonRedLobsterToken.sol</h4>
          <FaChevronDown
            className={`transform transition-transform ${expanded === "commonRedLobsterToken" ? "rotate-180" : ""}`}
          />
        </div>
        {expanded === "commonRedLobsterToken" && (
          <div>
            <p className="mb-2 text-text-light mt-6">
              Address:{" "}
              <code className="bg-neutral-light px-1 py-0.5 rounded">
                <a
                  className="hover:text-primary-dark"
                  target="_blank"
                  href={"https://basescan.org/address/" + contractAddresses.commonRedLobsterToken}
                >
                  {contractAddresses.commonRedLobsterToken}
                </a>
              </code>
            </p>
            <p className="mb-2 text-text-light mt-6">
              This ERC20 token represents caught lobsters that can be freely transferred and used onchain as a
              composable token. New Lobster types can be created by implementing{" "}
              <code className="bg-neutral-light px-1 py-0.5 rounded">ILobsterToken.sol</code>.
            </p>
            <div className="bg-neutral-light p-4 rounded-md">
              <pre className="text-sm">
                <code>
                  {`function whitelistPool(address _pool) external
function unwhitelistPool(address _pool) external
function mintLobstersToPool(uint256 _amount) external
function isPoolWhitelisted(address _pool) public view returns (bool)`}
                </code>
              </pre>
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div
          className="flex justify-between items-center text-xl font-semibold mb-2 text-primary-dark cursor-pointer hover:bg-gray-100 p-2 rounded shadow-md px-4 py-2"
          onClick={() => toggleExpand("lobsterPotNFT")}
        >
          <h4>LobsterPotNFT.sol</h4>
          <FaChevronDown
            className={`transform transition-transform ${expanded === "lobsterPotNFT" ? "rotate-180" : ""}`}
          />
        </div>
        {expanded === "lobsterPotNFT" && (
          <div>
            <p className="mb-2 text-text-light mt-6">
              Address:{" "}
              <code className="bg-neutral-light px-1 py-0.5 rounded">
                <a
                  className="hover:text-primary-dark"
                  target="_blank"
                  href={"https://basescan.org/address/" + contractAddresses.lobsterPotNFT}
                >
                  {contractAddresses.lobsterPotNFT}
                </a>
              </code>
            </p>
            <p className="mb-2 text-text-light mt-6">
              This contract implements the{" "}
              <code className="bg-neutral-light px-1 py-0.5 rounded">IEquipmentNFT.sol</code> interface, allowing for
              future equipment types to be created that enable higher rarity lobster fishing.
            </p>
            <div className="bg-neutral-light p-4 rounded-md">
              <pre className="text-sm">
                <code>
                  {`function mintEquipment() public payable
function setDevelopmentWallet(address newDevelopmentWallet) external
function setImageURI(string memory newImageURI) external
function withdrawFunds() external
function MINT_PRICE() public view returns (uint256)
function developmentWallet() public view returns (address)
function imageURI() public view returns (string memory)`}
                </code>
              </pre>
            </div>
          </div>
        )}
      </div>

      <div className="mb-6">
        <div
          className="flex justify-between items-center text-xl font-semibold mb-2 text-primary-dark cursor-pointer hover:bg-gray-100 p-2 rounded shadow-md px-4 py-2"
          onClick={() => toggleExpand("fishingSpot")}
        >
          <h4>FishingSpot.sol</h4>
          <FaChevronDown
            className={`transform transition-transform ${expanded === "fishingSpot" ? "rotate-180" : ""}`}
          />
        </div>
        {expanded === "fishingSpot" && (
          <div>
            <p className="mb-2 text-text-light mt-6">
              Address:{" "}
              <code className="bg-neutral-light px-1 py-0.5 rounded">
                <a
                  className="hover:text-primary-dark"
                  target="_blank"
                  href={"https://basescan.org/address/" + contractAddresses.fishingSpot}
                >
                  {contractAddresses.fishingSpot}
                </a>
              </code>
            </p>
            <p className="mb-2 text-text-light mt-6">
              This contract implements fishing mechanics. Fishing Pools have a finite amount of lobsters in them to fish
              and can vary in rarity. New pools can be created by implementing{" "}
              <code className="bg-neutral-light px-1 py-0.5 rounded">IFishingSpot.sol</code>.
            </p>
            <div className="bg-neutral-light p-4 rounded-md">
              <pre className="text-sm">
                <code>
                  {`function fish() external
function baitArea(uint256 _amount) external
function equipmentNFT() public view returns (IERC721)
function lobsterToken() public view returns (ILobsterToken)
function lobsterAmount() public view returns (uint256)
function lastFishingTime(address fisher) public view returns (uint256)`}
                </code>
              </pre>
            </div>
          </div>
        )}
      </div>

      <p className="text-text-light">
        Developers can create new equipment types, lobster tokens, or fishing spots by implementing the respective
        interfaces and integrating with these base contracts. We will whitelist new pools so they can be baited with
        lobsters for all to enjoy!
      </p>
    </section>
  );
}
