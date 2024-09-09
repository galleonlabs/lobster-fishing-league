"use client";
import Footer from "src/components/Footer";
import MintEquipment from "src/components/MintEquipment";
import FishLobsters from "src/components/FishLobsters";
import BalanceDisplay from "src/components/BalanceDisplay";
import WalletConnect from "src/components/WalletConnect";
import { ONCHAINKIT_LINK } from "src/links";
import { useAccount, useChainId, useReadContract } from "wagmi";
import { useState, useEffect } from "react";
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

  if (!chainId || !isSupportedNetwork(chainId)) {
    return <div>Unsupported network. Please connect to Base Mainnet or Base Sepolia.</div>;
  }

  const contractAddresses = getContractAddresses(chainId);

  const { data: lobsterPotBalance } = useReadContract({
    address: contractAddresses.lobsterPotNFT,
    abi: lobsterPotNFTABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: crlBalance } = useReadContract({
    address: contractAddresses.commonRedLobsterToken,
    abi: commonRedLobsterTokenABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
  });

  const { data: fetchedLastFishingTime } = useReadContract({
    address: contractAddresses.fishingSpot,
    abi: fishingSpotABI,
    functionName: "lastFishingTime",
    args: address ? [address] : undefined,
  });

  useEffect(() => {
    if (fetchedLastFishingTime) {
      setLastFishingTime(BigInt(fetchedLastFishingTime.toString()));
    }
  }, [fetchedLastFishingTime]);

  const canFish = () => {
    if (!lastFishingTime) return true;
    const now = BigInt(Math.floor(Date.now() / 1000));
    return now - lastFishingTime >= BigInt(60); // 60 seconds cooldown
  };

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
            <div className="w-48 pt-2">{address ? <MintEquipment /> : <p>Please connect your wallet to mint</p>}</div>
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
                  {canFish() ? (
                    <div className="w-48">
                      <FishLobsters />
                    </div>
                  ) : (
                    <p className="font-normal text-md">Cool down active. Please wait before fishing again.</p>
                  )}
                </div>
              ) : (
                <p className="font-normal text-md">
                  You need a <span className="text-orange-500">Lobster Pot</span> to fish here.
                </p>
              )}
            </div>
          ) : (
            <p>Please connect your wallet to fish</p>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}
