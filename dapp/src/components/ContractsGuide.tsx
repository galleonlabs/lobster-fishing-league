import React from "react";

type ContractsGuideProps = {
  contractAddresses: {
    lobsterPotNFT: `0x${string}`;
    commonRedLobsterToken: `0x${string}`;
    fishingSpot: `0x${string}`;
  };
};

export default function ContractsGuide({ contractAddresses }: ContractsGuideProps) {
  return (
    <section className="bg-white rounded-lg shadow-md p-8 mb-8">
      <h3 className="text-2xl font-bold mb-4 text-primary-dark">Contracts Guide</h3>
      <p className="mb-4 text-text-light">Learn how to interact with our smart contracts and build on top of them:</p>

      <div className="mb-6">
        <h4 className="text-xl font-semibold mb-2 text-primary-dark">LobsterPotNFT</h4>
        <p className="mb-2 text-text-light">
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
        <p className="mb-2 text-text-light">
          This contract implements the IEquipmentNFT.sol interface, allowing for future equipment types to be created
          that enable higher rarity lobster fishing.
        </p>
        <div className="bg-neutral-light p-4 rounded-md">
          <pre className="text-sm">
            <code>
              {`function mintEquipment() public payable
function balanceOf(address owner) public view returns (uint256)
function tokenURI(uint256 tokenId) public view returns (string memory)`}
            </code>
          </pre>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-xl font-semibold mb-2 text-primary-dark">CommonRedLobsterToken</h4>
        <p className="mb-2 text-text-light">
          Address:{" "}
          <a
            className="hover:text-primary-dark"
            target="_blank"
            href={"https://basescan.org/address/" + contractAddresses.commonRedLobsterToken}
          >
            {contractAddresses.commonRedLobsterToken}
          </a>
        </p>
        <p className="mb-2 text-text-light">
          This ERC20 token represents caught lobsters that can be freely transferred and used onchain as a composable
          token. New Lobster types can be created by implementing ILobsterToken.sol.
        </p>
        <div className="bg-neutral-light p-4 rounded-md">
          <pre className="text-sm">
            <code>
              {`function mintLobstersToPool(uint256 _amount) public
function whitelistPool(address _pool) public onlyOwner
function balanceOf(address account) public view returns (uint256)`}
            </code>
          </pre>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-xl font-semibold mb-2 text-primary-dark">FishingSpot</h4>
        <p className="mb-2 text-text-light">
          Address:{" "}
          <a
            className="hover:text-primary-dark"
            target="_blank"
            href={"https://basescan.org/address/" + contractAddresses.fishingSpot}
          >
            {contractAddresses.fishingSpot}
          </a>
        </p>
        <p className="mb-2 text-text-light">
          This contract implements fishing mechanics, Fishing Pools have a finite amount of Lobsters in them to fish and
          can vary in rarity. New pools can be created by implementing IFishingSpot.sol.
        </p>
        <div className="bg-neutral-light p-4 rounded-md">
          <pre className="text-sm">
            <code>
              {`function fish() public
function baitArea(uint256 _amount) external onlyOwner
function lastFishingTime(address fisher) public view returns (uint256)`}
            </code>
          </pre>
        </div>
      </div>

      <p className="text-text-light">
        Developers can create new equipment types, lobster tokens, or fishing spots by implementing the respective
        interfaces and integrating with these base contracts. We will whitelist new pools so they can be baited with
        Lobsters for all to enjoy!
      </p>
    </section>
  );
}
