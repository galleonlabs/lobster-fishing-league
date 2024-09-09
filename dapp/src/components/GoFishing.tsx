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
  const [isAnimating, setIsAnimating] = React.useState(false);

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
      setIsAnimating(true);
      await writeContract({
        address: contractAddresses.fishingSpot,
        abi: fishingSpotABI,
        functionName: "fish",
      });
    } catch (err) {
      console.error("Fishing error:", err);
      setErrorMessage(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setTimeout(() => setIsAnimating(false), 3000); // Stop animation after 3 seconds
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
    <section className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="flex items-center mb-4">
        <Image src="/pond.png" alt="Fishing Spot" width={48} height={48} className="mr-4" />
        <h3 className="text-2xl font-bold text-primary-dark">Fishing Spot</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative h-64 bg-blue-300 rounded-lg overflow-hidden">
          <div className="absolute inset-0 bg-blue-400 opacity-50 animate-wave"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            {isAnimating && <div className="w-1 h-32 bg-gray-800 origin-bottom animate-fishing-rod"></div>}
            <Image
              src="/lobster.png"
              alt="Lobster"
              width={64}
              height={64}
              className={`absolute bottom-4 ${isAnimating ? "animate-bounce" : ""}`}
            />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 border border-text shadow-inner">
          <h4 className="font-semibold text-lg mb-2">Fishing Status</h4>
          {address ? (
            <>
              {lobsterPotBalance && lobsterPotBalance > BigInt(0) ? (
                <>
                  {canFish ? (
                    <button
                      onClick={handleFish}
                      disabled={isPending || isConfirming || isAnimating}
                      className="w-full bg-primary-dark text-white rounded-md px-4 py-2 hover:bg-opacity-80 disabled:bg-gray-400 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg mb-4"
                    >
                      {isPending || isConfirming || isAnimating ? "Fishing..." : "Cast Your Line"}
                    </button>
                  ) : (
                    <div className="mb-4">
                      <p className="text-text font-semibold mb-2">
                        Cooldown active. Please wait before fishing again.
                      </p>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <div
                          className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-linear"
                          style={{ width: `${((60 - remainingCooldown) / 60) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">{remainingCooldown} seconds remaining</p>
                    </div>
                  )}
                  {errorMessage && <p className="text-red-500 mb-2">Error: {errorMessage}</p>}
                  {isSuccess && (
                    <div className="p-4 bg-green-100 text-green-700 rounded-md mb-4">
                      <p className="font-semibold">Fishing successful!</p>
                      <p>Check your inventory for your catch.</p>
                    </div>
                  )}
                  <div className="bg-blue-50 p-4 rounded-md">
                    <h5 className="font-semibold mb-2">Fishing Spot Overview</h5>
                    <ul className="list-disc list-inside text-sm text-gray-700">
                      <li>Catch Rate: 1 lobster per successful cast</li>
                      <li>Cooldown: 60 seconds between casts</li>
                      <li>Equipment: Lobster Pot (Owned: {lobsterPotBalance.toString()})</li>
                    </ul>
                  </div>
                </>
              ) : (
                <p className="text-text font-semibold">
                  You need a <span className="text-primary-dark">Lobster Pot</span> to fish here. Visit the Equipment
                  Shop to get one!
                </p>
              )}
            </>
          ) : (
            <p className="text-text font-semibold">Please connect your wallet to start fishing</p>
          )}
        </div>
      </div>
    </section>
  );
}
