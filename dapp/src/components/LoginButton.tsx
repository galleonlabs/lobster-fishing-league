'use client';
import WalletWrapper from './WalletWrapper';

export default function LoginButton() {
  return (
    <WalletWrapper
      className="min-w-[90px]  hover:bg-neutral transition duration-300 border bg-primary-dark  text-white rounded-sm border-white px-4 py-2 "
      text="Connect Wallet"
      withWalletAggregator={true}
    />
  );
}
