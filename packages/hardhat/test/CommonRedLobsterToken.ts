import { expect } from "chai";
import { ethers } from "hardhat";
import { CommonRedLobsterToken } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("CommonRedLobsterToken", function () {
  let commonRedLobsterToken: CommonRedLobsterToken;
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;
  let addr2: HardhatEthersSigner;

  before(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();
    const tokenFactory = await ethers.getContractFactory("CommonRedLobsterToken");
    commonRedLobsterToken = (await tokenFactory.deploy()) as CommonRedLobsterToken;
    await commonRedLobsterToken.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await commonRedLobsterToken.owner()).to.equal(owner.address);
    });
  });

  describe("Whitelisting Pools", function () {
    it("Should whitelist a pool", async function () {
      await commonRedLobsterToken.whitelistPool(addr1.address);
      expect(await commonRedLobsterToken.isPoolWhitelisted(addr1.address)).to.be.true;
    });

    it("Should unwhitelist a pool", async function () {
      const alreadyWhitelisted = await commonRedLobsterToken.isPoolWhitelisted(addr1.address);
      if (!alreadyWhitelisted) await commonRedLobsterToken.whitelistPool(addr1.address);
      await commonRedLobsterToken.unwhitelistPool(addr1.address);
      expect(await commonRedLobsterToken.isPoolWhitelisted(addr1.address)).to.be.false;
    });

    it("Should not whitelist an already whitelisted pool", async function () {
      const alreadyWhitelisted = await commonRedLobsterToken.isPoolWhitelisted(addr1.address);
      if (!alreadyWhitelisted) await commonRedLobsterToken.whitelistPool(addr1.address);
      await expect(commonRedLobsterToken.whitelistPool(addr1.address)).to.be.revertedWith("Pool already whitelisted");
    });
  });

  describe("Minting Lobsters", function () {
    it("Should mint lobsters to a whitelisted pool", async function () {
      const alreadyWhitelisted = await commonRedLobsterToken.isPoolWhitelisted(addr1.address);
      if (!alreadyWhitelisted) await commonRedLobsterToken.whitelistPool(addr1.address);
      await commonRedLobsterToken.connect(addr1).mintLobstersToPool(100);
      expect(await commonRedLobsterToken.balanceOf(addr1.address)).to.equal(100);
    });

    it("Should not mint lobsters to a non-whitelisted pool", async function () {
      await expect(commonRedLobsterToken.connect(addr2).mintLobstersToPool(100)).to.be.revertedWith(
        "Sender is not a whitelisted pool",
      );
    });

    it("Should not mint lobsters with zero amount", async function () {
      const alreadyWhitelisted = await commonRedLobsterToken.isPoolWhitelisted(addr1.address);
      if (!alreadyWhitelisted) await commonRedLobsterToken.whitelistPool(addr1.address);
      await expect(commonRedLobsterToken.connect(addr1).mintLobstersToPool(0)).to.be.revertedWith(
        "Amount must be greater than zero",
      );
    });
  });
});
