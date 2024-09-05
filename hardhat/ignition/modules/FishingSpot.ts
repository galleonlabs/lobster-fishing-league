import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DEFAULT_EQUIPMENT_NFT_ADDRESS = "0x456..."; // Replace with a default LobsterPotNFT address
const DEFAULT_LOBSTER_TOKEN_ADDRESS = "0x789..."; // Replace with a default CommonRedLobsterToken address
const DEFAULT_LOBSTER_AMOUNT = 1n; // Default lobster amount per fishing

const FishingSpotModule = buildModule("FishingSpotModule", (m) => {
  const equipmentNFTAddress = m.getParameter("equipmentNFTAddress", DEFAULT_EQUIPMENT_NFT_ADDRESS);
  const lobsterTokenAddress = m.getParameter("lobsterTokenAddress", DEFAULT_LOBSTER_TOKEN_ADDRESS);
  const lobsterAmount = m.getParameter("lobsterAmount", DEFAULT_LOBSTER_AMOUNT);

  const fishingSpot = m.contract("FishingSpot", [equipmentNFTAddress, lobsterTokenAddress, lobsterAmount]);
  
  return { fishingSpot };
});

export default FishingSpotModule;
