import hre from "hardhat";

async function main() {
  const commonRedLobsterTokenAddress = "0x58108c89530f1de255421b35b2079b4277d13ce9"; // Replace with actual address
  const lobsterPotNFTAddress = "0x1c1b9c0adace0d01807b54652ed379f7e1cc133c"; // Replace with actual address
  const fishingSpotAddress = "0xa28605a467afe56d63d306067dcd699d02cdf2c0"; // Replace with actual address

  console.log("Verifying CommonRedLobsterToken...");
  await hre.run("verify:verify", {
    address: commonRedLobsterTokenAddress,
    constructorArguments: [],
  });

  console.log("Verifying LobsterPotNFT...");
  await hre.run("verify:verify", {
    address: lobsterPotNFTAddress,
    constructorArguments: [
      "0x30B0D5758c79645Eb925825E1Ee8A2c448812F37", // Replace with the development wallet address
      "https://example.com/lobster.png", // Replace with the actual image URI
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
