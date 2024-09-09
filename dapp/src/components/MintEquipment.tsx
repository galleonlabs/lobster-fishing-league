import React, { useState } from "react";
import { useAccount, useChainId, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { getContractAddresses, lobsterPotNFTABI, isSupportedNetwork } from "../constants";

export default function MintEquipment() {
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

  const handleMint = () => {
    writeContract({
      address: contractAddresses.lobsterPotNFT,
      abi: lobsterPotNFTABI,
      functionName: "mintEquipment",
      value: parseEther("0.001"),
    });
  };

  React.useEffect(() => {
    if (isConfirmed) {
      setIsSuccess(true);
    }
  }, [isConfirmed]);

  if (!address) {
    return <div>Please connect your wallet to mint</div>;
  }

  return (
    <div>
      <button
        onClick={handleMint}
        disabled={isPending || isConfirming}
        className="bg-black text-white rounded-md px-4 py-2 hover:bg-opacity-80"
      >
        {isPending || isConfirming ? "Minting..." : "Mint Lobster Pot"}
      </button>
      {error && <p className="text-red-500 mt-2">Error in minting your equipment.</p>}
      {isSuccess && <p className="text-green-500 mt-2">Minting successful!</p>}
    </div>
  );
}
