import hre from "hardhat";

async function main() {
  const contractAddress = "0x3b8cef7960f80a5fa38f2edc1ac728c4cb52bc94"; // Replace with the deployed contract address

  console.log("Verifying CommonRedLobsterToken...");

  await hre.run("verify:verify", {
    address: contractAddress,
    constructorArguments: [],
  });

  console.log("CommonRedLobsterToken verified successfully");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
