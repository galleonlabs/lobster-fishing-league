import hre from "hardhat";
import { parseEther } from "viem";

async function main() {
  console.log("Deploying FishingSpot...");

  // Make sure to replace these with the actual deployed addresses
  const lobsterPotNFTAddress = "0x0Ef5b42084af61E040d6febA6E43bcA4fAaD15cB"; // Replace with actual LobsterPotNFT address
  const commonRedLobsterTokenAddress = "0x3b8cEF7960F80A5fA38F2Edc1aC728C4Cb52Bc94"; // Replace with actual CommonRedLobsterToken address
  const lobsterAmount = parseEther("1"); // Adjust as needed

  const fishingSpot = await hre.viem.deployContract("FishingSpot", [
    lobsterPotNFTAddress,
    commonRedLobsterTokenAddress,
    lobsterAmount,
  ]);

  console.log("FishingSpot deployed to:", fishingSpot.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
