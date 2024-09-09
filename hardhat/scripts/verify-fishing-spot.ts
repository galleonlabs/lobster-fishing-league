import hre from "hardhat";
import { parseEther } from "viem";

async function main() {
  const contractAddress = "0xe299626f8ce4ae54bfe90a960894afcf57cae5f9"; // Replace with the deployed contract address
  const lobsterPotNFTAddress = "0xefcae45bc663b01d5f3900409bc8f48b4f6ed534"; // Replace with the LobsterPotNFT address
  const commonRedLobsterTokenAddress = "0xca413ec990295ca71824be7a0051b4610737c773"; // Replace with the CommonRedLobsterToken address
  const lobsterAmount = parseEther("1"); // Make sure this matches the value used in deployment

  console.log("Verifying FishingSpot...");

  await hre.run("verify:verify", {
    address: contractAddress,
    constructorArguments: [lobsterPotNFTAddress, commonRedLobsterTokenAddress, lobsterAmount],
  });

  console.log("FishingSpot verified successfully");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
