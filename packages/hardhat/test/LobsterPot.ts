import { expect } from "chai";
import { ethers } from "hardhat";
import { LobsterPotNFT } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("LobsterPotNFT", function () {
  const DEV_ADDRESS = "0x30B0D5758c79645Eb925825E1Ee8A2c448812F37";
  const IMAGE_URL = "https://galleonlabs.io/galleon.png";
  let lobsterPotNFT: LobsterPotNFT;
  let owner: HardhatEthersSigner;

  before(async () => {
    [owner] = await ethers.getSigners();
    const yourContractFactory = await ethers.getContractFactory("LobsterPotNFT");
    lobsterPotNFT = (await yourContractFactory.deploy(DEV_ADDRESS, IMAGE_URL)) as LobsterPotNFT;
    await lobsterPotNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await lobsterPotNFT.owner()).to.equal(owner.address);
    });
  });

  describe("Minting", function () {
    it("Should mint a new NFT", async function () {
      await lobsterPotNFT.mintLobsterPot({ value: ethers.parseEther("0.001") });
      expect(await lobsterPotNFT.balanceOf(owner.address)).to.equal(1);
    });
  });
});
