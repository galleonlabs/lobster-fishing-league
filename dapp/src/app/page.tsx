"use client";
import Footer from "src/components/Footer";
import MintEquipment from "src/components/MintEquipment";
import FishLobsters from "src/components/FishLobsters";
import BalanceDisplay from "src/components/BalanceDisplay";
import WalletConnect from "src/components/WalletConnect";
import { ONCHAINKIT_LINK } from "src/links";
import { useAccount, useChainId, useReadContract } from "wagmi";
import { useState, useEffect, useCallback } from "react";
import {
  lobsterPotNFTABI,
  commonRedLobsterTokenABI,
  fishingSpotABI,
  getContractAddresses,
  isSupportedNetwork,
} from "../constants";

export default function Page() {
  const { address } = useAccount();
  const chainId = useChainId();
  const [lastFishingTime, setLastFishingTime] = useState<bigint>(BigInt(0));
  const [remainingCooldown, setRemainingCooldown] = useState<number>(0);

  if (!chainId || !isSupportedNetwork(chainId)) {
    return <div>Unsupported network. Please connect to Base Mainnet or Base Sepolia.</div>;
  }

  const contractAddresses = getContractAddresses(chainId);

  const { data: lobsterPotBalance, refetch: refetchLobsterPotBalance } = useReadContract({
    address: contractAddresses.lobsterPotNFT,
    abi: lobsterPotNFTABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: crlBalance, refetch: refetchCrlBalance } = useReadContract({
    address: contractAddresses.commonRedLobsterToken,
    abi: commonRedLobsterTokenABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: fetchedLastFishingTime, refetch: refetchLastFishingTime } = useReadContract({
    address: contractAddresses.fishingSpot,
    abi: fishingSpotABI,
    functionName: "lastFishingTime",
    args: address ? [address] : undefined,
  });

  const updateCooldown = useCallback(() => {
    if (!lastFishingTime) return;
    const now = BigInt(Math.floor(Date.now() / 1000));
    const cooldownTime = BigInt(60); // 60 seconds cooldown
    const timePassed = now - lastFishingTime;
    if (timePassed < cooldownTime) {
      setRemainingCooldown(Number(cooldownTime - timePassed));
    } else {
      setRemainingCooldown(0);
    }
  }, [lastFishingTime]);

  useEffect(() => {
    if (fetchedLastFishingTime) {
      setLastFishingTime(BigInt(fetchedLastFishingTime.toString()));
    }
  }, [fetchedLastFishingTime]);

  useEffect(() => {
    updateCooldown();
    const interval = setInterval(updateCooldown, 1000);
    return () => clearInterval(interval);
  }, [updateCooldown]);

  useEffect(() => {
    // Set up an interval to refetch data periodically
    const interval = setInterval(() => {
      refetchLobsterPotBalance();
      refetchCrlBalance();
      refetchLastFishingTime();
    }, 10000); // Refetch every 10 seconds

    return () => clearInterval(interval);
  }, [refetchLobsterPotBalance, refetchCrlBalance, refetchLastFishingTime]);

  const canFish = remainingCooldown === 0;

  const handleMintSuccess = useCallback(() => {
    refetchLobsterPotBalance();
  }, [refetchLobsterPotBalance]);

  const handleFishSuccess = useCallback(() => {
    refetchLastFishingTime();
    refetchCrlBalance();
  }, [refetchLastFishingTime, refetchCrlBalance]);

  return (
    <div className="flex h-full w-96 max-w-full flex-col px-1 md:w-[1008px]">
      <section className="mt-6 mb-6 flex w-full flex-col md:flex-row">
        <div className="flex w-full flex-row items-center justify-between gap-2 md:gap-0">
          <a className="font-bold text-2xl" href={ONCHAINKIT_LINK} title="Lobster Fishing League" rel="noreferrer">
            Lobster Fishing League
          </a>
          <WalletConnect />
        </div>
      </section>
      <section className="">
        <div className="">
          <BalanceDisplay lobsterPotBalance={lobsterPotBalance ?? BigInt(0)} crlBalance={crlBalance ?? BigInt(0)} />
        </div>
        {!lobsterPotBalance || lobsterPotBalance === BigInt(0) ? (
          <div className="pl-1">
            <p className="mt-4">
              To begin your journey in the Lobster Fishing League, you're going to need a{" "}
              <span className="text-orange-500">Lobster Pot</span>.
            </p>
            <p>This is a basic equipment item that'll let you make your first catch.</p>
            <h4 className="font-semibold pt-1">Properties</h4>
            <ul className=" list-disc pl-8 pb-2">
              <li>Mint cost: 0.001 ETH</li>
              <li>Fish speed: 60 seconds</li>
              <li>Quality: Common Lobsters</li>
            </ul>
            <p>Click below to mint your Lobster Pot.</p>
            <div>
              {address ? (
                <div className="w-48 pt-2">
                  <MintEquipment onSuccess={handleMintSuccess} />
                </div>
              ) : (
                <p className="italic font-semibold">Please connect your wallet to mint</p>
              )}
            </div>
          </div>
        ) : (
          <div className="mt-6 pl-1">
            <p>
              Nice! You're all set up with a <span className="text-orange-500">Lobster Pot</span>. You can now start
              fishing for <span className="text-red-500">Common Red Lobsters</span>.
            </p>
            <p>
              It looks like there's an active <span className="text-blue-500">Fishing Spot</span> below, go ahead and
              start catching Lobsters.
            </p>
          </div>
        )}
        <div className="mt-4 px-4 py-4 rounded-md  border border-black">
          <p className="font-bold text-xl text-blue-500">Fishing Spot</p>
          {address ? (
            <div className="pt-2">
              {lobsterPotBalance && lobsterPotBalance > BigInt(0) ? (
                <div>
                  {canFish ? (
                    <div className="w-48">
                      <FishLobsters onSuccess={handleFishSuccess} />
                    </div>
                  ) : (
                    <p className="font-normal text-md">
                      Cooldown active. Please wait {remainingCooldown} seconds before fishing again.
                    </p>
                  )}
                </div>
              ) : (
                <p className="font-normal text-md">
                  You need a <span className="text-orange-500">Lobster Pot</span> to fish here.
                </p>
              )}
            </div>
          ) : (
            <p className="italic font-semibold">Please connect your wallet to fish</p>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
