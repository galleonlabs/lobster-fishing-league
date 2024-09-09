"use client";
import {
  Transaction,
  TransactionButton,
  TransactionStatus,
  TransactionStatusAction,
  TransactionStatusLabel,
} from "@coinbase/onchainkit/transaction";
import type { TransactionError, TransactionResponse } from "@coinbase/onchainkit/transaction";
import type { ContractFunctionParameters } from "viem";
import { useChainId } from "wagmi";
import { parseEther } from "viem";
import {
  BASE_SEPOLIA_CHAIN_ID,
  BASE_MAINNET_CHAIN_ID,
  getContractAddresses,
  lobsterPotNFTABI,
  fishingSpotABI,
  isSupportedNetwork,
} from "../constants";

type TransactionWrapperProps = {
  action: "mint" | "fish";
};

export default function TransactionWrapper({ action }: TransactionWrapperProps) {
  const chainId = useChainId();
  const defaultChainId = process.env.NODE_ENV === "development" ? BASE_SEPOLIA_CHAIN_ID : BASE_MAINNET_CHAIN_ID;

  const currentChainId = chainId || defaultChainId;

  if (!isSupportedNetwork(currentChainId)) {
    console.error("Unsupported network");
    return null;
  }

  const contractAddresses = getContractAddresses(currentChainId);

  const contracts =
    action === "mint"
      ? ([
          {
            address: contractAddresses.lobsterPotNFT,
            abi: lobsterPotNFTABI,
            functionName: "mintEquipment",
            args: [],
            value: parseEther("0.001"), // Convert to Wei
          },
        ] as unknown as ContractFunctionParameters[])
      : ([
          {
            address: contractAddresses.fishingSpot,
            abi: fishingSpotABI,
            functionName: "fish",
            args: [],
          },
        ] as unknown as ContractFunctionParameters[]);

  const handleError = (err: TransactionError) => {
    console.error("Transaction error:", err);
    console.error("Error details:", JSON.stringify(err, null, 2));
    // You can add more user-friendly error handling here
  };

  const handleSuccess = (response: TransactionResponse) => {
    console.log("Transaction successful", response);
    // You can add more user-friendly success handling here
  };

  return (
    <div className="">
      <Transaction
        contracts={contracts}
        className=""
        chainId={currentChainId}
        onError={handleError}
        onSuccess={handleSuccess}
      >
        <TransactionButton
          className="bg-black rounded-md text-white hover:bg-black hover:opacity-70"
          text={action === "mint" ? "Mint" : "Fish"}
        ></TransactionButton>
        <TransactionStatus>
          <TransactionStatusLabel />
          <TransactionStatusAction />
        </TransactionStatus>
      </Transaction>
    </div>
  );
}
