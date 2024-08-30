import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";
import { LobsterPotNFT } from "../typechain-types";

const DEV_ADDRESS = "0x30B0D5758c79645Eb925825E1Ee8A2c448812F37";
const IMAGE_URL = "https://oldschool.runescape.wiki/images/thumb/Lobster_pot_detail.png/640px-Lobster_pot_detail.png";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
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

  await deploy("LobsterPotNFT", {
    from: deployer,
    // Contract constructor arguments
    args: [DEV_ADDRESS, IMAGE_URL],
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const contract = await hre.ethers.getContract<LobsterPotNFT>("LobsterPotNFT", deployer);

  if (hre.network.name !== "localhost") {
    await hre.run("verify:verify", {
      address: await contract.getAddress(),
      constructorArguments: [DEV_ADDRESS, IMAGE_URL],
    });
  }

  console.log("👋 Contract:", await contract.name());
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["LobsterPotNFT"];
