"use client";
import Footer from "src/components/Footer";
import TransactionWrapper from "src/components/TransactionWrapper";
import WalletWrapper from "src/components/WalletWrapper";
import BalanceDisplay from "src/components/BalanceDisplay";
import { ONCHAINKIT_LINK } from "src/links";
import OnchainkitSvg from "src/svg/OnchainkitSvg";
import { useAccount } from "wagmi";
import LoginButton from "../components/LoginButton";
import SignupButton from "../components/SignupButton";
import { useReadContract } from "wagmi";
import {
  lobsterPotNFTABI,
  lobsterPotNFTAddress,
  commonRedLobsterTokenABI,
  commonRedLobsterTokenAddress,
} from "../constants";

export default function Page() {
  const { address } = useAccount();

  const { data: lobsterPotBalance } = useReadContract({
    address: lobsterPotNFTAddress,
    abi: lobsterPotNFTABI,
    functionName: "balanceOf",
    args: [address],
  }) as { data: bigint };

  const { data: crlBalance } = useReadContract({
    address: commonRedLobsterTokenAddress,
    abi: commonRedLobsterTokenABI,
    functionName: "balanceOf",
    args: [address],
  }) as { data: bigint };

  return (
    <div className="flex h-full w-96 max-w-full flex-col px-1 md:w-[1008px]">
      <section className="mt-6 mb-6 flex w-full flex-col md:flex-row">
        <div className="flex w-full flex-row items-center justify-between gap-2 md:gap-0">
          <a className="font-bold text-2xl" href={ONCHAINKIT_LINK} title="Lobster Fishing League" rel="noreferrer">
            Lobster Fishing League
          </a>
          <div className="flex items-center gap-3">
            <SignupButton />
            {!address && <LoginButton />}
          </div>
        </div>
      </section>
      <section className="">
        <>
          <div className="">
            <BalanceDisplay lobsterPotBalance={lobsterPotBalance} crlBalance={crlBalance} />
          </div>
          <>
            {!lobsterPotBalance ? (
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
                <div className="w-24">
                  {address ? (
                    <TransactionWrapper action="mint" />
                  ) : (
                    <WalletWrapper
                      className="rounded-md bg-black w-24 mt-2 hover:opacity-70  hover:bg-black"
                      text="Sign in"
                    />
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
                  It looks like there's an active <span className="text-blue-500">Fishing Spot</span> below, go ahead
                  and start catching Lobsters.
                </p>
              </div>
            )}
          </>
          <div className="mt-4 px-4 py-4 rounded-md  border border-black">
            <p className="font-bold text-xl text-blue-500">Fishing Spot</p>
            {address ? (
              <div className="pt-2">
                {lobsterPotBalance ? (
                  <div className="w-24">
                    <TransactionWrapper action="fish" />
                  </div>
                ) : (
                  <p className="font-normal text-md">
                    You need a <span className="text-orange-500">Lobster Pot</span> to fish here.
                  </p>
                )}
              </div>
            ) : (
              <WalletWrapper
                className="rounded-md bg-black w-24 max-w-24 mt-2 hover:opacity-70 hover:bg-black"
                text="Sign in"
              />
            )}
          </div>
        </>
      </section>
      <Footer />
    </div>
  );
}
