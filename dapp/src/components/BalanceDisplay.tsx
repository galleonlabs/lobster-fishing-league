"use client";
import { formatEther } from "viem";
import Image from "next/image";

export interface BalanceDisplayProps {
  lobsterPotBalance: bigint;
  crlBalance: bigint;
}

export default function BalanceDisplay({ lobsterPotBalance, crlBalance }: BalanceDisplayProps) {
  return (
    <div className="bg-primary-light rounded-lg p-6 mb-8">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow">
          <h4 className="font-semibold text-lg mb-4 text-text">Equipment</h4>
          <div className="flex items-center space-x-2 pb-1">
            <div className="w-12 h-12 bg-secondary-light rounded-md flex items-center justify-center border border-text">
              <Image src="/fishing.png" alt="Lobster Pot" width={32} height={32} />
            </div>
            <span className="text-text font-medium pl-2">Lobster Pot: {lobsterPotBalance?.toString() || "0"}</span>
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow">
          <h4 className="font-semibold text-lg mb-4 text-text">Lobster</h4>
          <div className="flex items-center space-x-2 pb-1">
            <div className="w-12 h-12 bg-secondary-light rounded-md flex items-center justify-center border border-text">
              <Image src="/lobster.png" alt="Common Red Lobster" width={32} height={32} />
            </div>
            <span className="text-text font-medium pl-2">
              Common Red Lobster: {formatEther(crlBalance)?.toString() || "0"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
