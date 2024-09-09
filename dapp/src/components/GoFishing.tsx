import React from "react";
import { useChainId, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { getContractAddresses, fishingSpotABI, isSupportedNetwork } from "../constants";

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
    return <div>Unsupported network. Please connect to Base Mainnet or Base Sepolia.</div>;
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
    <section className="bg-white rounded-xl shadow-md p-8 mb-8">
      <h3 className="text-2xl font-bold mb-4 text-primary-dark">Go Fishing</h3>
      <p className="mb-4">Ready to catch some lobsters? Head to the fishing spot!</p>
      {address ? (
        <div>
          {lobsterPotBalance && lobsterPotBalance > BigInt(0) ? (
            <div>
              {canFish ? (
                <button
                  onClick={handleFish}
                  disabled={isPending || isConfirming}
                  className="bg-primary-dark text-white rounded-md px-4 py-2 hover:bg-opacity-80 disabled:bg-gray-400"
                >
                  {isPending || isConfirming ? "Fishing..." : "Fish for Lobsters"}
                </button>
              ) : (
                <p className="text-secondary-dark font-semibold">
                  Cooldown active. Please wait {remainingCooldown} seconds before fishing again.
                </p>
              )}
              {errorMessage && <p className="text-red-500 mt-2">Error: {errorMessage}</p>}
              {isSuccess && <p className="text-green-500 mt-2">Fishing successful!</p>}
            </div>
          ) : (
            <p className="text-secondary-dark font-semibold">
              You need a <span className="text-primary-dark">Lobster Pot</span> to fish here.
            </p>
          )}
        </div>
      ) : (
        <p className="text-secondary-dark font-semibold">Please connect your wallet to fish</p>
      )}
    </section>
  );
}
