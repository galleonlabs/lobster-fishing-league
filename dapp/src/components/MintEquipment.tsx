import React from "react";
import { useChainId, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseEther, formatEther } from "viem";
import { getContractAddresses, lobsterPotNFTABI, isSupportedNetwork } from "../constants";

type MintEquipmentProps = {
  address: `0x${string}` | undefined;
  lobsterPotBalance: bigint | undefined;
  onSuccess: () => void;
};

export default function MintEquipment({ address, lobsterPotBalance, onSuccess }: MintEquipmentProps) {
  const chainId = useChainId();
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

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

  React.useEffect(() => {
    if (isConfirmed) {
      setIsSuccess(true);
      onSuccess();
    }
  }, [isConfirmed, onSuccess]);

  React.useEffect(() => {
    if (error) {
      console.error("Contract write error:", error);
      setErrorMessage(error instanceof Error ? error.message : "An unknown error occurred");
    }
  }, [error]);

  return (
    <section className="bg-white rounded-xl shadow-md p-8 mb-8">
      <h3 className="text-2xl font-bold mb-4 text-primary-dark">Mint Your Lobster Pot</h3>
      <p className="mb-4">To begin your journey in the Lobster Fishing League, you're going to need a Lobster Pot.</p>
      <ul className="list-disc list-inside mb-4">
        <li>Mint cost: {mintPrice ? formatEther(mintPrice).toString() : "Loading..."} ETH</li>
        <li>Fish speed: 60 seconds</li>
        <li>Quality: Common Lobsters</li>
      </ul>
      {address ? (
        <div>
          <button
            onClick={handleMint}
            disabled={isPending || isConfirming || !mintPrice}
            className="bg-primary-dark text-white rounded-md px-4 py-2 hover:bg-opacity-80 disabled:bg-gray-400"
          >
            {isPending || isConfirming ? "Minting..." : "Mint Lobster Pot"}
          </button>
          {errorMessage && <p className="text-red-500 mt-2">Error: {errorMessage}</p>}
          {isSuccess && <p className="text-green-500 mt-2">Minting successful!</p>}
        </div>
      ) : (
        <p className="text-secondary-dark font-semibold">Please connect your wallet to mint</p>
      )}
    </section>
  );
}
