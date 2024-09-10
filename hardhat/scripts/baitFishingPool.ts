import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import dotenv from "dotenv";
import * as fishingSpot from "../artifacts/contracts/FishingSpot.sol/FishingSpot.json";
import * as commonRedLobsterToken from "../artifacts/contracts/CommonRedLobsterToken.sol/CommonRedLobsterToken.json";
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
  const fishingSpotAddress = "0x3411c7A63025D40863280a4790fB57308bd34550"; // Your deployed FishingSpot contract address
  const commonRedLobsterTokenAddress = "0xbC69A9e8768746C6E9A4Cf619E0e441EF40E9ba9"; // Your deployed CommonRedLobsterToken contract address

  const fishingSpotAbi = fishingSpot.abi;
  const commonRedLobsterTokenAbi = commonRedLobsterToken.abi;

  // Amount of lobsters to bait the area with
  const baitAmount = parseEther("10000"); // Adjust this value as needed

  console.log(`Baiting area with ${baitAmount} lobsters...`);

  try {
    // First, we need to whitelist the FishingSpot in the CommonRedLobsterToken contract if not already done
    const whitelistHash = await walletClient.writeContract({
      address: commonRedLobsterTokenAddress,
      abi: commonRedLobsterTokenAbi,
      functionName: "whitelistPool",
      args: [fishingSpotAddress],
    });

    await publicClient.waitForTransactionReceipt({
      hash: whitelistHash,
    });

    console.log("FishingSpot whitelisted (or was already whitelisted)");

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
