import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DEFAULT_DEVELOPMENT_WALLET = "0x123..."; // Replace with a default development wallet address
const DEFAULT_IMAGE_URI = "https://example.com/lobster.png"; // Replace with a default image URI

const LobsterPotNFTModule = buildModule("LobsterPotNFTModule", (m) => {
  const developmentWallet = m.getParameter("developmentWallet", DEFAULT_DEVELOPMENT_WALLET);
  const imageURI = m.getParameter("imageURI", DEFAULT_IMAGE_URI);

  const lobsterPotNFT = m.contract("LobsterPotNFT", [developmentWallet, imageURI]);

  return { lobsterPotNFT };
});

export default LobsterPotNFTModule;
