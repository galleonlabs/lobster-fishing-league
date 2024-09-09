import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { getAddress, parseEther } from "viem";
import hre from "hardhat";

describe("CommonRedLobsterToken", function () {
  async function deployCommonRedLobsterTokenFixture() {
    const [owner, user, pool1, pool2] = await hre.viem.getWalletClients();

    const commonRedLobsterToken = await hre.viem.deployContract("CommonRedLobsterToken");

    return { commonRedLobsterToken, owner, user, pool1, pool2 };
  }

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      const { commonRedLobsterToken } = await loadFixture(deployCommonRedLobsterTokenFixture);

      expect(await commonRedLobsterToken.read.name()).to.equal("CommonRedLobster");
      expect(await commonRedLobsterToken.read.symbol()).to.equal("CRL");
    });

    it("Should set the deployer as the owner", async function () {
      const { commonRedLobsterToken, owner } = await loadFixture(deployCommonRedLobsterTokenFixture);

      expect(await commonRedLobsterToken.read.owner()).to.equal(getAddress(owner.account.address));
    });
  });

  describe("Whitelisting", function () {
    it("Should allow owner to whitelist a pool", async function () {
      const { commonRedLobsterToken, owner, pool1 } = await loadFixture(deployCommonRedLobsterTokenFixture);

      await commonRedLobsterToken.write.whitelistPool([pool1.account.address], { account: owner.account });
      expect(await commonRedLobsterToken.read.isPoolWhitelisted([pool1.account.address])).to.be.true;
    });

    it("Should not allow non-owner to whitelist a pool", async function () {
      const { commonRedLobsterToken, user, pool1 } = await loadFixture(deployCommonRedLobsterTokenFixture);

      await expect(
        commonRedLobsterToken.write.whitelistPool([pool1.account.address], { account: user.account })
      ).to.be.rejectedWith("OwnableUnauthorizedAccount");
    });
  });

  describe("Minting", function () {
    it("Should allow whitelisted pool to mint tokens", async function () {
      const { commonRedLobsterToken, owner, pool1 } = await loadFixture(deployCommonRedLobsterTokenFixture);

      await commonRedLobsterToken.write.whitelistPool([pool1.account.address], { account: owner.account });
      await commonRedLobsterToken.write.mintLobstersToPool([BigInt(100)], { account: pool1.account });
      expect(await commonRedLobsterToken.read.balanceOf([pool1.account.address])).to.equal(BigInt(100));
    });

    it("Should not allow non-whitelisted address to mint tokens", async function () {
      const { commonRedLobsterToken, user } = await loadFixture(deployCommonRedLobsterTokenFixture);

      await expect(
        commonRedLobsterToken.write.mintLobstersToPool([BigInt(100)], { account: user.account })
      ).to.be.rejectedWith("Sender is not a whitelisted pool");
    });
  });
});
