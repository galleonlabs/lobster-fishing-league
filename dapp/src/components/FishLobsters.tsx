import React, { useEffect, useState } from "react";
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { getContractAddresses, fishingSpotABI, isSupportedNetwork } from "../constants";

type FishLobstersProps = {
  onSuccess: () => void;
};

export default function FishLobsters({ onSuccess }: FishLobstersProps) {
  const { address } = useAccount();
  const chainId = useChainId();
  const [isSuccess, setIsSuccess] = useState(false);

  if (!chainId || !isSupportedNetwork(chainId)) {
    return <div>Unsupported network. Please connect to Base Mainnet or Base Sepolia.</div>;
  }

  const contractAddresses = getContractAddresses(chainId);

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleFish = async () => {
    try {
      await writeContract({
        address: contractAddresses.fishingSpot,
        abi: fishingSpotABI,
        functionName: "fish",
      });
    } catch (error) {
      console.error("Error fishing:", error);
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      setIsSuccess(true);
    }
  }, [isConfirmed]);

  useEffect(() => {
    if (isSuccess) {
      onSuccess();
    }
  }, [isSuccess]);

  if (!address) {
    return <div>Please connect your wallet to fish</div>;
  }

  return (
    <div>
      <button
        onClick={handleFish}
        disabled={isPending || isConfirming}
        className="bg-black text-white rounded-md px-4 py-2 hover:bg-opacity-80"
      >
        {isPending || isConfirming ? "Fishing..." : "Fish for Lobsters"}
      </button>
      {error && <p className="text-red-500 mt-2">Error in fishing.</p>}
      {isSuccess && <p className="text-green-500 mt-2">Fishing successful!</p>}
    </div>
  );
}
