'use client';
import WalletWrapper from './WalletWrapper';

export default function LoginButton() {
  return (
    <WalletWrapper
      className="min-w-[90px] bg-primary-dark hover:bg-primary transition duration-300 border border-primary rounded-md px-4 py-2 text-white"
      text="Connect Wallet"
      withWalletAggregator={true}
    />
  );
}
