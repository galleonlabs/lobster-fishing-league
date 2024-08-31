import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { CommonRedLobsterToken, FishingSpot, LobsterPotNFT } from "../typechain-types";
import { parseEther } from "viem";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployFishingSpot: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const lobsterToken = await hre.ethers.getContract<CommonRedLobsterToken>("CommonRedLobsterToken", deployer);
  const lobsterPot = await hre.ethers.getContract<LobsterPotNFT>("LobsterPotNFT", deployer);

  await deploy("FishingSpot", {
    from: deployer,
    // Contract constructor arguments
    args: [await lobsterPot.getAddress(), await lobsterToken.getAddress(), parseEther("1")],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const contract = await hre.ethers.getContract<FishingSpot>("FishingSpot", deployer);
  const whiteListPoolTx = await lobsterToken.whitelistPool(await contract.getAddress());
  await whiteListPoolTx.wait();
  const baitAreaTx = await contract.baitArea(parseEther("1000"));
  await baitAreaTx.wait();

  if (hre.network.name !== "localhost") {
    await hre.run("verify:verify", {
      address: await contract.getAddress(),
      constructorArguments: [],
    });
  }

  console.log("👋 Contract:", await contract.getAddress());
};

export default deployFishingSpot;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployFishingSpot.tags = ["FishingSpot"];
