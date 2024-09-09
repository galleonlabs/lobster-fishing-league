"use client";
import { formatEther } from "viem";

export interface BalanceDisplayProps {
  lobsterPotBalance: bigint;
  crlBalance: bigint;
}

export default function BalanceDisplay({ lobsterPotBalance, crlBalance }: BalanceDisplayProps) {
  return (
    <>
      <h2 className="text-xl pl-1 font-bold">Backpack</h2>
      <div className="mt-2 border py-2 px-4 rounded-md border-black">
        <div className="grid grid-cols-2">
          <div className="">
            <h4 className="font-semibold">Equipment</h4>
            <p>
              <span className="text-orange-500">Lobster Pot</span>: {lobsterPotBalance?.toString() || "0"}
            </p>
          </div>
          <div className="">
            <h4 className="font-semibold">Lobster</h4>
            <p>
              <span className="text-red-500">Common Red Lobster</span>: {formatEther(crlBalance)?.toString() || "0"}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
