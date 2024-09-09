import React, { useEffect, useState } from "react";
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseEther } from "viem";
import { getContractAddresses, lobsterPotNFTABI, isSupportedNetwork } from "../constants";

type MintEquipmentProps = {
  onSuccess: () => void;
};

export default function MintEquipment({ onSuccess }: MintEquipmentProps) {
  const { address } = useAccount();
  const chainId = useChainId();
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!chainId || !isSupportedNetwork(chainId)) {
    return <div>Unsupported network. Please connect to Base Mainnet or Base Sepolia.</div>;
  }

  const contractAddresses = getContractAddresses(chainId);

  const { data: mintPrice } = useReadContract({
    address: contractAddresses.lobsterPotNFT,
    abi: lobsterPotNFTABI,
    functionName: "MINT_PRICE",
  });

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleMint = async () => {
    try {
      setErrorMessage(null);
      if (!mintPrice) {
        throw new Error("Unable to fetch mint price");
      }
      await writeContract({
        address: contractAddresses.lobsterPotNFT,
        abi: lobsterPotNFTABI,
        functionName: "mintEquipment",
        value: mintPrice,
      });
    } catch (err) {
      console.error("Minting error:", err);
      setErrorMessage(err instanceof Error ? err.message : "An unknown error occurred");
    }
  };

  useEffect(() => {
    if (isConfirmed) {
      setIsSuccess(true);
      onSuccess();
    }
  }, [isConfirmed, onSuccess]);

  useEffect(() => {
    if (error) {
      console.error("Contract write error:", error);
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
    }
  }, [error]);

  if (!address) {
    return <div>Please connect your wallet to mint</div>;
  }

  return (
    <div>
      <button
        onClick={handleMint}
        disabled={isPending || isConfirming || !mintPrice}
        className="bg-black text-white rounded-md px-4 py-2 hover:bg-opacity-80 disabled:bg-gray-400"
      >
        {isPending || isConfirming
          ? "Minting..."
          : `Mint Lobster Pot`}
      </button>
      {errorMessage && <p className="text-red-500 mt-2">Error: {errorMessage}</p>}
      {isSuccess && <p className="text-green-500 mt-2">Minting successful!</p>}
      <div className="mt-2 text-xs italic pl-1">
        <p>Contract Address: {contractAddresses.lobsterPotNFT}</p>

      </div>
    </div>
  );
}
