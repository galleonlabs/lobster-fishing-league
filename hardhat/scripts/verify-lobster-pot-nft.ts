import hre from "hardhat";

async function main() {
  const contractAddress = "0x721552FdBB7419554Db03C694f22f2a7DAeFad3C"; // Replace with the deployed contract address
  const developmentWallet = "0x30B0D5758c79645Eb925825E1Ee8A2c448812F37"; // Replace with the development wallet address used in deployment
  const imageURI = "https://lobsterfishingleague.com/lobster.png"; // Replace with the image URI used in deployment

  console.log("Verifying LobsterPotNFT...");

  await hre.run("verify:verify", {
    address: contractAddress,
    constructorArguments: [developmentWallet, imageURI],
  });

  console.log("LobsterPotNFT verified successfully");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
