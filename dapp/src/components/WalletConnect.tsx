import React, { useEffect, useState } from "react";
import { BASE_MAINNET_CHAIN_ID, BASE_SEPOLIA_CHAIN_ID } from "src/constants";
import { useAccount, useConnect, useDisconnect, useSwitchChain, useChainId } from "wagmi";
import { injected } from "wagmi/connectors";

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { switchChain } = useSwitchChain();
  const chain = useChainId();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const targetChainId = process.env.NODE_ENV === "development" ? BASE_SEPOLIA_CHAIN_ID : BASE_MAINNET_CHAIN_ID;

  useEffect(() => {
    if (isConnected && chain !== targetChainId) {
      switchChain({ chainId: targetChainId });
    }
  }, [isConnected, chain, switchChain, targetChainId]);

  const handleConnect = async () => {
    try {
      await connect({ connector: injected() });
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
    setIsDropdownOpen(false);
  };

  if (isConnected && address) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-primary text-white rounded-md px-4 py-2 hover:bg-primary-light transition duration-300 flex items-center"
        >
          <span className="mr-2">{`${address.slice(0, 6)}...${address.slice(-4)}`}</span>
          <svg
            className="w-4 h-4 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
            <button
              onClick={handleDisconnect}
              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="bg-primary text-white border border-primary rounded-md px-4 py-2 hover:bg-primary-dark hover:border hover:border-white transition duration-300"
    >
      Connect Wallet
    </button>
  );
}
