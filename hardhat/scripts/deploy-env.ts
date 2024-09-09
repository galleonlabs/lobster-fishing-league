import hre from "hardhat";
import { parseEther } from "viem";

async function main() {
  const [deployer] = await hre.viem.getWalletClients();

  console.log("Deploying contracts with the account:", deployer.account.address);

  // Deploy CommonRedLobsterToken
  console.log("Deploying CommonRedLobsterToken...");
  const commonRedLobsterToken = await hre.viem.deployContract("CommonRedLobsterToken");
  console.log("CommonRedLobsterToken deployed to:", commonRedLobsterToken.address);

  // Deploy LobsterPotNFT
  console.log("Deploying LobsterPotNFT...");
  const developmentWallet = deployer.account.address; // You can change this if needed
  const imageURI = "https://lobsterfishingleague.com/pot.png"; // Replace with your actual image URI
  const lobsterPotNFT = await hre.viem.deployContract("LobsterPotNFT", [developmentWallet, imageURI]);
  console.log("LobsterPotNFT deployed to:", lobsterPotNFT.address);

  // Deploy FishingSpot
  console.log("Deploying FishingSpot...");
  const lobsterAmount = parseEther("1"); // Adjust as needed
  const fishingSpot = await hre.viem.deployContract("FishingSpot", [
    lobsterPotNFT.address,
    commonRedLobsterToken.address,
    lobsterAmount,
  ]);
  console.log("FishingSpot deployed to:", fishingSpot.address);

  // Whitelist the FishingSpot in the CommonRedLobsterToken contract
  console.log("Whitelisting FishingSpot...");
  await commonRedLobsterToken.write.whitelistPool([fishingSpot.address]);
  console.log("FishingSpot whitelisted successfully");

  console.log("All contracts deployed and set up successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
