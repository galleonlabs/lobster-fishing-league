import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import dotenv from "dotenv";
import { FishingSpot__factory, CommonRedLobsterToken__factory } from "../typechain-types";

dotenv.config();

async function main() {
  const privateKeyString = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKeyString) {
    throw new Error("No private key found in .env file");
  }

  // Convert the private key string to the format expected by Viem
  const privateKey = `0x${
    privateKeyString.startsWith("0x") ? privateKeyString.slice(2) : privateKeyString
  }` as `0x${string}`;

  const account = privateKeyToAccount(privateKey);

  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http(),
  });

  // Replace these with your actual deployed contract addresses
  const fishingSpotAddress = "0x73746cd30f31fc629d0ab23d0008c5accd89ed80"; // Your deployed FishingSpot contract address
  const commonRedLobsterTokenAddress = "0x4e393232c1bad4297cf98da7cc17bc094ab01755"; // Your deployed CommonRedLobsterToken contract address

  const fishingSpotAbi = FishingSpot__factory.abi;
  const commonRedLobsterTokenAbi = CommonRedLobsterToken__factory.abi;

  // Amount of lobsters to bait the area with
  const baitAmount = parseEther("10000"); // Adjust this value as needed

  console.log(`Baiting area with ${baitAmount} lobsters...`);

  try {
    // Now, call the baitArea function
    const baitAreaHash = await walletClient.writeContract({
      address: fishingSpotAddress,
      abi: fishingSpotAbi,
      functionName: "baitArea",
      args: [baitAmount],
    });

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: baitAreaHash,
    });

    console.log(`Area baited successfully! Transaction hash: ${receipt.transactionHash}`);

    // Check the balance of the FishingSpot contract
    const balance = await publicClient.readContract({
      address: commonRedLobsterTokenAddress,
      abi: commonRedLobsterTokenAbi,
      functionName: "balanceOf",
      args: [fishingSpotAddress],
    });

    console.log(`FishingSpot contract now has ${balance} lobster tokens`);
  } catch (error) {
    console.error("Error baiting the area:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
