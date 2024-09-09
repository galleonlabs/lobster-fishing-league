import hre from "hardhat";

async function main() {
  const contractAddress = "0x1669329730A555F5EFbFA413700793430C554793"; // Replace with the deployed contract address
  const lobsterPotNFTAddress = "0x0Ef5b42084af61E040d6febA6E43bcA4fAaD15cB"; // Replace with the LobsterPotNFT address
  const commonRedLobsterTokenAddress = "0x3b8cEF7960F80A5fA38F2Edc1aC728C4Cb52Bc94"; // Replace with the CommonRedLobsterToken address
  const lobsterAmount = BigInt(1); // Make sure this matches the value used in deployment

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
