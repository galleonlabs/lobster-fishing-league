import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import deployedContracts from "~~/contracts/deployedContracts";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const FishingDapp = () => {
  const { address: connectedAddress } = useAccount();

  const [poolAddress, setPoolAddress] = useState("");
  const [lastFishingTime, setLastFishingTime] = useState<number | null>(null);

  const { writeContractAsync: mintLobsterPot, isMining: isMinting } = useScaffoldWriteContract("LobsterPotNFT");
  const { writeContractAsync: fishForLobsters, isMining: isFishing } = useScaffoldWriteContract("FishingSpot");
  const { writeContractAsync: whitelistPool, isMining: isWhitelisting } =
    useScaffoldWriteContract("CommonRedLobsterToken");

  const { data: lobsterPotBalance } = useScaffoldReadContract({
    contractName: "LobsterPotNFT",
    functionName: "balanceOf",
    args: [connectedAddress],
  });

  const { data: lobsterTokenBalance } = useScaffoldReadContract({
    contractName: "CommonRedLobsterToken",
    functionName: "balanceOf",
    args: [connectedAddress],
  });

  const { data: fishingPoolBalance } = useScaffoldReadContract({
    contractName: "CommonRedLobsterToken",
    functionName: "balanceOf",
    args: [deployedContracts[11155111].FishingSpot.address],
  });

  const { data: lastFishingTimestamp } = useScaffoldReadContract({
    contractName: "FishingSpot",
    functionName: "lastFishingTime",
    args: [connectedAddress],
  });

  useEffect(() => {
    if (lastFishingTimestamp) {
      setLastFishingTime(Number(lastFishingTimestamp));
    }
  }, [lastFishingTimestamp]);

  const handleMintLobsterPot = async () => {
    try {
      await mintLobsterPot({
        functionName: "mintLobsterPot",
        value: BigInt(0.001 * 10 ** 18),
      });
      alert("Lobster Pot minted successfully!");
    } catch (error) {
      console.error(error);
      alert("Minting failed!");
    }
  };

  const handleFishForLobsters = async () => {
    try {
      await fishForLobsters({
        functionName: "fish",
      });

      alert("Successfully fished for lobsters!");
    } catch (error) {
      console.error(error);
      alert("Fishing failed!");
    }
  };

  const handleWhitelistPool = async () => {
    try {
      await whitelistPool({
        functionName: "whitelistPool",
        args: [poolAddress],
      });

      alert("Pool whitelisted successfully!");
    } catch (error) {
      console.error(error);
      alert("Whitelisting failed!");
    }
  };

  const canFish = lastFishingTime ? Date.now() / 1000 - lastFishingTime >= 60 : true;

  return (
    <div className="flex flex-col items-center space-y-8 p-8">
      {/* Hero Section */}
      <div className="text-center">
        <img src="/logo.png" alt="Lobster Fishing League" className="mx-auto w-32 h-32" />
        <h1 className="text-4xl font-bold mt-4">Lobster Fishing League</h1>
      </div>

      {/* Fishing Equipment Section */}
      <div className="w-full max-w-2xl text-center">
        <h2 className="text-2xl font-semibold mb-4">Fishing Equipment</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-bold">Lobster Pot NFT</h3>
          <p className="mt-2">Mint a Lobster Pot NFT for 0.001 ETH</p>
          <button
            className="btn btn-primary mt-4"
            onClick={handleMintLobsterPot}
            disabled={isMinting || (lobsterPotBalance !== undefined && lobsterPotBalance > 0)}
          >
            {isMinting ? "Minting..." : "Mint Lobster Pot"}
          </button>
          {lobsterPotBalance && lobsterPotBalance > 0 && (
            <p className="mt-2 text-green-500">You already own a Lobster Pot NFT.</p>
          )}
        </div>
      </div>

      {/* Fishing Section */}
      <div className="w-full max-w-2xl text-center">
        <h2 className="text-2xl font-semibold mb-4">Fishing Spot</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h3 className="text-xl font-bold">Main Fishing Spot</h3>
          <p className="mt-2">You need a Lobster Pot NFT to fish here.</p>
          <p className="mt-2">
            Your CommonRedLobster Balance: {lobsterTokenBalance ? lobsterTokenBalance.toString() : "Loading..."}
          </p>
          <p className="mt-2">
            Fishing Pool Balance: {fishingPoolBalance ? fishingPoolBalance.toString() : "Loading..."}
          </p>
          <button
            className="btn btn-primary mt-4"
            onClick={handleFishForLobsters}
            disabled={isFishing || !canFish || (lobsterPotBalance !== undefined && lobsterPotBalance === 0n)}
          >
            {isFishing ? "Fishing..." : "Fish for Lobsters"}
          </button>
          {!canFish && <p className="mt-2 text-red-500">You can only fish once per minute. Please wait.</p>}
        </div>
      </div>

      {/* Admin Section */}
      {connectedAddress === "0x30B0D5758c79645Eb925825E1Ee8A2c448812F37" && (
        <div className="w-full max-w-2xl text-center">
          <h2 className="text-2xl font-semibold mb-4">Admin Section</h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold">Whitelist a Pool</h3>
            <input
              type="text"
              placeholder="Pool Address"
              value={poolAddress}
              onChange={e => setPoolAddress(e.target.value)}
              className="input input-bordered mt-2"
            />
            <button className="btn btn-primary mt-4" onClick={handleWhitelistPool} disabled={isWhitelisting}>
              {isWhitelisting ? "Whitelisting..." : "Whitelist Pool"}
            </button>
          </div>
        </div>
      )}

      {/* Coming Soon Section */}
      <div className="w-full max-w-2xl text-center">
        <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
        <div className="bg-white shadow-md rounded-lg p-6">
          <p>New types of equipment, lobsters, and fishing spots are coming soon. Stay tuned!</p>
        </div>
      </div>

      {/* Socials Section */}
      <div className="w-full max-w-2xl text-center">
        <h2 className="text-2xl font-semibold mb-4">Follow Us</h2>
        <div className="flex justify-center space-x-4">
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <img src="/twitter.png" alt="Twitter" className="w-8 h-8" />
          </a>
          <a href="https://discord.com" target="_blank" rel="noopener noreferrer">
            <img src="/discord.png" alt="Discord" className="w-8 h-8" />
          </a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer">
            <img src="/github.png" alt="GitHub" className="w-8 h-8" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default FishingDapp;
