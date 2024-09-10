import { parseEther } from "viem";
import hre from "hardhat";

async function verifyContract(params: any): Promise<void> {
  try {
    console.log(`Attempting to verify contract at ${params.address}`);
    await hre.run("verify:verify", params);
    console.log(`Contract at ${params.address} verified successfully`);
  } catch (error: any) {
    if (error.message.toLowerCase().includes("already verified")) {
      console.log(`Contract at ${params.address} is already verified`);
    } else {
      console.error(`Error verifying contract at ${params.address}:`, error);
      throw error;
    }
  }
}

async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const commonRedLobsterTokenAddress = "0xbC69A9e8768746C6E9A4Cf619E0e441EF40E9ba9";
  const lobsterPotNFTAddress = "0x721552FdBB7419554Db03C694f22f2a7DAeFad3C";
  const fishingSpotAddress = "0x3411c7A63025D40863280a4790fB57308bd34550";

  const contracts = [
    {
      name: "CommonRedLobsterToken",
      address: commonRedLobsterTokenAddress,
      constructorArguments: [],
    },
    {
      name: "LobsterPotNFT",
      address: lobsterPotNFTAddress,
      constructorArguments: ["0x30B0D5758c79645Eb925825E1Ee8A2c448812F37", "https://lobsterfishingleague.com/pot.png"],
    },
    {
      name: "FishingSpot",
      address: fishingSpotAddress,
      constructorArguments: [lobsterPotNFTAddress, commonRedLobsterTokenAddress, parseEther("1")],
    },
  ];

  for (const contract of contracts) {
    let retries = 3;
    while (retries > 0) {
      try {
        await verifyContract(contract);
        break;
      } catch (error) {
        console.log(`Verification failed for ${contract.name}. Retries left: ${retries - 1}`);
        if (retries === 1) {
          console.error(`All retries exhausted for ${contract.name}`);
        } else {
          await delay(10000); // Wait for 10 seconds before retrying
        }
        retries--;
      }
    }
    await delay(5000); // Wait for 5 seconds between contract verifications
  }

  console.log("Verification process completed!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Unhandled error during verification:", error);
    process.exit(1);
  });
