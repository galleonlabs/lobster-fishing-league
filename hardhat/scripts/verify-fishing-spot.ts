import hre from "hardhat";
import { parseEther } from "viem";

async function main() {
  const contractAddress = "0x25586b34884eb88bfd91c2cb278788c089ca7d83"; // Replace with the deployed contract address
  const lobsterPotNFTAddress = "0x521a43fc26f14335077cf0250f7e517e5dd0b022"; // Replace with the LobsterPotNFT address
  const commonRedLobsterTokenAddress = "0xefb30026e8a13500dd6f5273e336aafe1a9897fc"; // Replace with the CommonRedLobsterToken address
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
