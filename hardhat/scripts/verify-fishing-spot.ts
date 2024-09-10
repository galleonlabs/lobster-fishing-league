import hre from "hardhat";
import { parseEther } from "viem";

async function main() {
  const contractAddress = "0x3411c7A63025D40863280a4790fB57308bd34550"; // Replace with the deployed contract address
  const lobsterPotNFTAddress = "0x721552FdBB7419554Db03C694f22f2a7DAeFad3C"; // Replace with the LobsterPotNFT address
  const commonRedLobsterTokenAddress = "0xbC69A9e8768746C6E9A4Cf619E0e441EF40E9ba9"; // Replace with the CommonRedLobsterToken address
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
