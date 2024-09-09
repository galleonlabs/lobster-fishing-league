import * as dotenv from "dotenv";
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox-viem";
import "@nomicfoundation/hardhat-chai-matchers";
import "@nomicfoundation/hardhat-verify";

dotenv.config();

// Helper function to check required environment variables
const getEnvVariable = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    throw new Error(`Please set the ${key} environment variable`);
  }
  return value;
};

const providerApiKey = getEnvVariable("ALCHEMY_API_KEY");
const deployerPrivateKey = getEnvVariable("DEPLOYER_PRIVATE_KEY");
const etherscanApiKey = getEnvVariable("ETHERSCAN_API_KEY");

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: "hardhat",
  networks: {
    mainnet: {
      url: `https://eth-mainnet.alchemyapi.io/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${providerApiKey}`,
      accounts: [deployerPrivateKey],
    },
    base: {
      url: `https://mainnet.base.org/${providerApiKey}`,
      accounts: [deployerPrivateKey],
      chainId: 8453,
    },
    baseSepolia: {
      url: `https://sepolia.base.org/${providerApiKey}`,
      accounts: [deployerPrivateKey],
      chainId: 84532,
    },
  },
  etherscan: {
    apiKey: {
      mainnet: etherscanApiKey,
      sepolia: etherscanApiKey,
      baseSepolia: etherscanApiKey,
      base: etherscanApiKey,
    },
  },
  sourcify: {
    enabled: true,
  },
};

export default config;
