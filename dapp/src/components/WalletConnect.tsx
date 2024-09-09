import React from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <div>
        <span className="mr-2">{`${address?.slice(0, 6)}...${address?.slice(-4)}`}</span>
        <button onClick={() => disconnect()} className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600">
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => connect({ connector: injected() })}
      className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
    >
      Connect Wallet
    </button>
  );
}
