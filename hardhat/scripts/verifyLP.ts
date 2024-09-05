import { parseEther, formatEther } from "viem";
import hre from "hardhat";

async function main() {
  // Verify LobsterPotNFT contract
  await hre.run("verify:verify", {
    address: "",
    constructorArguments: [
      
    ],
  });
}

main()
  .then(() => process.exit())
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

  