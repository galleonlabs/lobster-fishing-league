import React from "react";
import { useChainId, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { getContractAddresses, fishingSpotABI, isSupportedNetwork } from "../constants";
import Image from "next/image";

type GoFishingProps = {
  address: `0x${string}` | undefined;
  lobsterPotBalance: bigint | undefined;
  canFish: boolean;
  remainingCooldown: number;
  onSuccess: () => void;
};

export default function GoFishing({
  address,
  lobsterPotBalance,
  canFish,
  remainingCooldown,
  onSuccess,
}: GoFishingProps) {
  const chainId = useChainId();
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  if (!chainId || !isSupportedNetwork(chainId)) {
    return (
      <div className="text-red-500 font-bold">Unsupported network. Please connect to Base Mainnet or Base Sepolia.</div>
    );
  }

  const contractAddresses = getContractAddresses(chainId);

  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleFish = async () => {
    try {
      setErrorMessage(null);
      await writeContract({
        address: contractAddresses.fishingSpot,
        abi: fishingSpotABI,
        functionName: "fish",
      });
    } catch (err) {
      console.error("Fishing error:", err);
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
        {/* <Image src="/fishing-spot.png" alt="Fishing Spot" width={48} height={48} className="mr-4" /> */}
        <h3 className="text-2xl font-bold text-primary-dark">Fishing Spot</h3>
      </div>
      <p className="mb-4 text-text-light">Cast your line and catch some lobsters in this bountiful fishing spot!</p>
      {address ? (
        <div>
          {lobsterPotBalance && lobsterPotBalance > BigInt(0) ? (
            <div className="bg-white rounded-lg p-4 shadow-inner">
              {canFish ? (
                <button
                  onClick={handleFish}
                  disabled={isPending || isConfirming}
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
                      Fishing...
                    </span>
                  ) : (
                    "Cast Your Line"
                  )}
                </button>
              ) : (
                <div className="text-center">
                  <p className="text-secondary-dark font-semibold mb-2">
                    Cooldown active. Please wait before fishing again.
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${(remainingCooldown / 60) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{remainingCooldown} seconds remaining</p>
                </div>
              )}
              {errorMessage && <p className="text-red-500 mt-2">Error: {errorMessage}</p>}
              {isSuccess && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md">
                  <p className="font-semibold">Fishing successful!</p>
                  <p>Check your inventory for your catch.</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-secondary-dark font-semibold">
              You need a <span className="text-primary-dark">Lobster Pot</span> to fish here. Visit the Equipment Shop
              to get one!
            </p>
          )}
        </div>
      ) : (
        <p className="text-secondary-dark font-semibold">Please connect your wallet to start fishing</p>
      )}
    </section>
  );
}
