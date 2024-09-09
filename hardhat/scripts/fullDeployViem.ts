import { createPublicClient, createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import dotenv from "dotenv";
import hre from "hardhat";
import { CommonRedLobsterToken__factory, LobsterPotNFT__factory, FishingSpot__factory } from "../typechain-types";

dotenv.config();

async function main() {
  const privateKey = process.env.DEPLOYER_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error("No private key found in .env file");
  }

  const pkey = `0x${privateKey.startsWith("0x") ? privateKey.slice(2) : privateKey}` as `0x${string}`;

  const account = privateKeyToAccount(pkey as `0x${string}`);

  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  const walletClient = createWalletClient({
    account,
    chain: base,
    transport: http(),
  });

  console.log("Deploying contracts with the account:", account.address);

  // Deploy CommonRedLobsterToken
  console.log("Deploying CommonRedLobsterToken...");
  const commonRedLobsterTokenBytecode = CommonRedLobsterToken__factory.bytecode;
  const commonRedLobsterTokenAbi = CommonRedLobsterToken__factory.abi;
  const commonRedLobsterTokenHash = await walletClient.deployContract({
    abi: commonRedLobsterTokenAbi,
    bytecode: commonRedLobsterTokenBytecode,
    account,
  });

  const commonRedLobsterTokenReceipt = await publicClient.waitForTransactionReceipt({
    hash: commonRedLobsterTokenHash,
    confirmations: 5,
  });
  const commonRedLobsterTokenAddress = commonRedLobsterTokenReceipt.contractAddress;
  if (!commonRedLobsterTokenAddress) throw new Error("CommonRedLobsterToken deployment failed");
  console.log("CommonRedLobsterToken deployed to:", commonRedLobsterTokenAddress);

  // Deploy LobsterPotNFT
  console.log("Deploying LobsterPotNFT...");
  const developmentWallet = account.address;
  const imageURI = "https://lobsterfishingleague.com/lobster.png";
  const lobsterPotNFTBytecode = LobsterPotNFT__factory.bytecode;
  const lobsterPotNFTAbi = LobsterPotNFT__factory.abi;
  const lobsterPotNFTHash = await walletClient.deployContract({
    abi: lobsterPotNFTAbi,
    bytecode: lobsterPotNFTBytecode,
    account,
    args: [developmentWallet, imageURI],
  });

  const lobsterPotNFTReceipt = await publicClient.waitForTransactionReceipt({
    hash: lobsterPotNFTHash,
    confirmations: 5,
  });
  const lobsterPotNFTAddress = lobsterPotNFTReceipt.contractAddress;
  if (!lobsterPotNFTAddress) throw new Error("LobsterPotNFT deployment failed");
  console.log("LobsterPotNFT deployed to:", lobsterPotNFTAddress);

  // Deploy FishingSpot
  console.log("Deploying FishingSpot...");
  const lobsterAmount = parseEther("1");
  const fishingSpotBytecode = FishingSpot__factory.bytecode;
  const fishingSpotAbi = FishingSpot__factory.abi;
  const fishingSpotHash = await walletClient.deployContract({
    abi: fishingSpotAbi,
    bytecode: fishingSpotBytecode,
    account,
    args: [lobsterPotNFTAddress, commonRedLobsterTokenAddress, lobsterAmount],
  });

  const fishingSpotReceipt = await publicClient.waitForTransactionReceipt({
    hash: fishingSpotHash,
    confirmations: 5,
  });
  const fishingSpotAddress = fishingSpotReceipt.contractAddress;
  if (!fishingSpotAddress) throw new Error("FishingSpot deployment failed");
  console.log("FishingSpot deployed to:", fishingSpotAddress);

  // Whitelist the FishingSpot in the CommonRedLobsterToken contract
  console.log("Whitelisting FishingSpot...");
  const whitelistHash = await walletClient.writeContract({
    address: commonRedLobsterTokenAddress,
    abi: commonRedLobsterTokenAbi,
    functionName: "whitelistPool",
    args: [fishingSpotAddress],
  });

  await publicClient.waitForTransactionReceipt({
    hash: whitelistHash,
    confirmations: 5,
  });
  console.log("FishingSpot whitelisted successfully");

  console.log("All contracts deployed, verified, and set up successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
