import { formatEther } from "viem";
import Image from "next/image";

export interface BalanceDisplayProps {
  lobsterPotBalance: bigint;
  crlBalance: bigint;
}

export default function BalanceDisplay({ lobsterPotBalance, crlBalance }: BalanceDisplayProps) {
  return (
    <div className="bg-primary-light rounded-xl mt-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BalanceCard title="Equipment">
          <BalanceItem
            icon="/pot.png"
            alt="Lobster Pot"
            label="Lobster Pot"
            value={lobsterPotBalance?.toString() || "0"}
          />
          <BalanceItem icon="" alt="Empty Bag Slot" label="Empty Bag Slot" value="" />
        </BalanceCard>
        <BalanceCard title="Lobster">
          <BalanceItem
            icon="/lobster.png"
            alt="Common Red Lobster"
            label="Common Red Lobster"
            value={formatEther(crlBalance)?.toString() || "0"}
          />
          <BalanceItem icon="" alt="Empty Bag Slot" label="Empty Bag Slot" value="" />
        </BalanceCard>
      </div>
    </div>
  );
}

function BalanceCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow">
      <h4 className="font-semibold text-lg mb-4 text-text">{title}</h4>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function BalanceItem({ icon, alt, label, value }: { icon: string; alt: string; label: string; value: string }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 bg-secondary-light rounded-md flex items-center justify-center border border-text">
        {icon ? <Image src={icon} alt={alt} width={32} height={32} /> : <div className="w-8 h-8" />}
      </div>
      <div className="flex-grow">
        <span className="text-text font-medium">{label}</span>
        {value && <p className="text-sm text-gray-600">{value}</p>}
      </div>
    </div>
  );
}
