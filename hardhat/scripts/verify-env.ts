import hre from "hardhat";

async function main() {
  const commonRedLobsterTokenAddress = "0x4e393232c1bad4297cf98da7cc17bc094ab01755"; // Replace with actual address
  const lobsterPotNFTAddress = "0x7a8eac96611fc2220ec2f2ded9c0772b5987c7d4"; // Replace with actual address
  const fishingSpotAddress = "0x73746cd30f31fc629d0ab23d0008c5accd89ed80"; // Replace with actual address

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
      BigInt(1), // Replace with the actual lobster amount
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
