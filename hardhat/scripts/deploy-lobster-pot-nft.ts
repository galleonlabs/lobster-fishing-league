import hre from "hardhat";
import { parseEther } from "viem";

async function main() {
  console.log("Deploying LobsterPotNFT...");

  const [deployer] = await hre.viem.getWalletClients();
  const developmentWallet = deployer.account.address; // You can change this to a different address if needed
  const imageURI = "https://lobsterfishingleague.com/lobster.png"; // Replace with your actual image URI

  const lobsterPotNFT = await hre.viem.deployContract("LobsterPotNFT", [developmentWallet, imageURI]);

  console.log("LobsterPotNFT deployed to:", lobsterPotNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
