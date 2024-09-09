"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAccount, useChainId, useReadContract } from "wagmi";
import {
  lobsterPotNFTABI,
  commonRedLobsterTokenABI,
  fishingSpotABI,
  getContractAddresses,
  isSupportedNetwork,
} from "../constants";
import Navbar from "src/components/Navbar";
import Hero from "src/components/Hero";
import MintEquipment from "src/components/MintEquipment";
import GoFishing from "src/components/GoFishing";
import ContractsGuide from "src/components/ContractsGuide";
import ComingSoon from "src/components/ComingSoon";
import Footer from "src/components/Footer";
import BalanceDisplay from "src/components/BalanceDisplay";

export default function Page() {
  const { address } = useAccount();
  const chainId = useChainId();
  const [lastFishingTime, setLastFishingTime] = useState<bigint>(BigInt(0));
  const [remainingCooldown, setRemainingCooldown] = useState<number>(0);

  if (!chainId || !isSupportedNetwork(chainId)) {
    return (
      <div className="text-center p-4 bg-red-100 text-red-700">
        Unsupported network. Please connect to Base Mainnet or Base Sepolia.
      </div>
    );
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
    <div className="min-h-screen bg-primary-light text-text-default flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Hero />
        <div className="space-y-8">
          <BalanceDisplay lobsterPotBalance={lobsterPotBalance ?? BigInt(0)} crlBalance={crlBalance ?? BigInt(0)} />
          <MintEquipment address={address} lobsterPotBalance={lobsterPotBalance} onSuccess={handleMintSuccess} />
          <GoFishing
            address={address}
            lobsterPotBalance={lobsterPotBalance}
            canFish={canFish}
            remainingCooldown={remainingCooldown}
            onSuccess={handleFishSuccess}
          />
          <ContractsGuide contractAddresses={contractAddresses} />
          <ComingSoon />
        </div>
      </main>
      <Footer />
    </div>
  );
}
