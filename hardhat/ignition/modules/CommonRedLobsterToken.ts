import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const CommonRedLobsterTokenModule = buildModule("CommonRedLobsterTokenModule", (m) => {
  const commonRedLobsterToken = m.contract("CommonRedLobsterToken", []);

  return { commonRedLobsterToken };
});

export default CommonRedLobsterTokenModule;
