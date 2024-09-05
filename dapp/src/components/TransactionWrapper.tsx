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
import {
  BASE_SEPOLIA_CHAIN_ID,
  lobsterPotNFTABI,
  lobsterPotNFTAddress,
  fishingSpotABI,
  fishingSpotAddress,
} from "../constants";

type TransactionWrapperProps = {
  action: "mint" | "fish";
};

export default function TransactionWrapper({ action }: TransactionWrapperProps) {
  const contracts =
    action === "mint"
      ? ([
          {
            address: lobsterPotNFTAddress,
            abi: lobsterPotNFTABI,
            functionName: "mintLobsterPot",
            args: [],
            value: "0.001", // MINT_PRICE in ETH
          },
        ] as unknown as ContractFunctionParameters[])
      : ([
          {
            address: fishingSpotAddress,
            abi: fishingSpotABI,
            functionName: "fish",
            args: [],
          },
        ] as unknown as ContractFunctionParameters[]);

  const handleError = (err: TransactionError) => {
    console.error("Transaction error:", err);
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
        chainId={BASE_SEPOLIA_CHAIN_ID}
        onError={handleError}
        onSuccess={handleSuccess}
      >
        <TransactionButton
          className=" bg-black rounded-md text-white hover:bg-black hover:opacity-70"
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
