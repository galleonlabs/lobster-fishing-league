import React from "react";
import { useChainId, useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { parseEther, formatEther } from "viem";
import { getContractAddresses, lobsterPotNFTABI, isSupportedNetwork } from "../constants";
import Image from "next/image";

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
    return (
      <div className="text-red-500 font-bold">Unsupported network. Please connect to Base Mainnet or Base Sepolia.</div>
    );
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
    <section className=" rounded-xl p-6 mb-8">
      <div className="flex items-center mb-2">
        {/* <Image src="/fishing.png" alt="Equipment Shop" width={48} height={48} className="mr-4 " /> */}
        <h3 className="text-2xl font-bold text-primary-dark">Equipment Shop</h3>
      </div>
      <p className="mb-4 text-text-light">Gear up for your fishing adventures! Get your Lobster Pot here.</p>
      <div className="bg-white rounded-lg p-4 shadow-inner">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Image src="/fishing.png" alt="Lobster Pot" width={64} height={64} className="mr-4 rounded-full p-2" />
            <div>
              <h4 className="font-semibold text-lg">Lobster Pot</h4>
              <p className="text-sm text-gray-600">Essential for catching lobsters</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold">{mintPrice ? formatEther(mintPrice).toString() : "Loading..."} ETH</p>
            <p className="text-sm text-gray-600">Current stock: ∞</p>
          </div>
        </div>
        <ul className="list-disc list-inside mb-4 text-sm text-gray-700">
          <li>Catch speed: 60 seconds</li>
          <li>Durability: Infinite</li>
          <li>Rarity: Common</li>
        </ul>
        {address ? (
          <div>
            <button
              onClick={handleMint}
              disabled={isPending || isConfirming || !mintPrice}
              className="w-full bg-primary-dark text-white rounded-md px-4 py-2 hover:bg-opacity-80 disabled:bg-gray-400 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg"
            >
              {isPending || isConfirming ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Minting...
                </span>
              ) : (
                "Mint Lobster Pot"
              )}
            </button>
            {errorMessage && <p className="text-red-500 mt-2">Error: {errorMessage}</p>}
            {isSuccess && (
              <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
                <p className="font-semibold">Minting successful!</p>
                <p>Your new Lobster Pot is ready for action.</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-secondary-dark font-semibold text-center">Please connect your wallet to mint equipment</p>
        )}
      </div>
      {lobsterPotBalance && lobsterPotBalance > BigInt(0) && (
        <div className="mt-4 p-4 bg-primary shadow-md rounded-md">
          <p className="font-semibold">
            You own {lobsterPotBalance.toString()} Lobster Pot{lobsterPotBalance > BigInt(1) ? "s" : ""}!
          </p>
          <p>Head to the Fishing Spot to start catching lobsters.</p>
        </div>
      )}
    </section>
  );
}
