import hre from "hardhat";

async function main() {
  console.log("Deploying CommonRedLobsterToken...");

  const commonRedLobsterToken = await hre.viem.deployContract("CommonRedLobsterToken");

  console.log("CommonRedLobsterToken deployed to:", commonRedLobsterToken.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
