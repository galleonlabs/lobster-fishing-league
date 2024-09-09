import hre from "hardhat";
import { parseEther } from "viem";

async function main() {
  const commonRedLobsterTokenAddress = "0xca413ec990295ca71824be7a0051b4610737c773"; // Replace with actual address
  const lobsterPotNFTAddress = "0xefcae45bc663b01d5f3900409bc8f48b4f6ed534"; // Replace with actual address
  const fishingSpotAddress = "0xe299626f8ce4ae54bfe90a960894afcf57cae5f9"; // Replace with actual address

  console.log("Verifying CommonRedLobsterToken...");
  await hre.run("verify:verify", {
    address: commonRedLobsterTokenAddress,
    contract: "contracts/CommonRedLobsterToken.sol:CommonRedLobsterToken",
    constructorArguments: [],
  });

  console.log("Verifying LobsterPotNFT...");
  await hre.run("verify:verify", {
    address: lobsterPotNFTAddress,
    constructorArguments: [
      "0x30B0D5758c79645Eb925825E1Ee8A2c448812F37", // Replace with the development wallet address
      "https://lobsterfishingleague.com/lobster.png", // Replace with the actual image URI
    ],
  });

  console.log("Verifying FishingSpot...");
  await hre.run("verify:verify", {
    address: fishingSpotAddress,
    constructorArguments: [
      lobsterPotNFTAddress,
      commonRedLobsterTokenAddress,
      parseEther("1"), // Replace with the actual lobster amount
    ],
  });

  console.log("All contracts verified successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
