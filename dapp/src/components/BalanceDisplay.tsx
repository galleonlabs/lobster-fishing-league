"use client";
import { formatEther } from "viem";
import Image from "next/image";

export interface BalanceDisplayProps {
  lobsterPotBalance: bigint;
  crlBalance: bigint;
}

export default function BalanceDisplay({ lobsterPotBalance, crlBalance }: BalanceDisplayProps) {
  return (
    <div className="bg-primary-light rounded-lg border border-primary p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-primary-dark">Backpack</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <h4 className="font-semibold text-lg mb-2 text-text">Equipment</h4>
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-secondary-light rounded-md flex items-center justify-center border border-text">
              <Image src="/fishing.png" alt="Lobster Pot" width={32} height={32} />
            </div>
            <span className="text-text font-medium">Lobster Pot: {lobsterPotBalance?.toString() || "0"}</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <h4 className="font-semibold text-lg mb-2 text-text">Lobster</h4>
          <div className="flex items-center space-x-2">
            <div className="w-12 h-12 bg-secondary-light rounded-md flex items-center justify-center border border-text">
              <Image src="/lobster.png" alt="Common Red Lobster" width={32} height={32} />
            </div>
            <span className="text-text font-medium">
              Common Red Lobster: {formatEther(crlBalance)?.toString() || "0"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
