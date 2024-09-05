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

  describe("whitelistPool", function () {
    it("Should whitelist a pool", async function () {
      const { commonRedLobsterToken, owner, pool1 } = await loadFixture(deployCommonRedLobsterTokenFixture);

      await expect(
        commonRedLobsterToken.write.whitelistPool([pool1.account.address], { account: owner.account.address })
      )
        .to.emit(commonRedLobsterToken, "PoolWhitelisted")
        .withArgs(getAddress(pool1.account.address));

      expect(await commonRedLobsterToken.read.isPoolWhitelisted([pool1.account.address])).to.be.true;
    });

    it("Should revert if called by non-owner", async function () {
      const { commonRedLobsterToken, user, pool1 } = await loadFixture(deployCommonRedLobsterTokenFixture);

      await expect(
        commonRedLobsterToken.write.whitelistPool([pool1.account.address], { account: user.account.address })
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert if pool is already whitelisted", async function () {
      const { commonRedLobsterToken, owner, pool1 } = await loadFixture(deployCommonRedLobsterTokenFixture);

      await commonRedLobsterToken.write.whitelistPool([pool1.account.address], { account: owner.account.address });

      await expect(
        commonRedLobsterToken.write.whitelistPool([pool1.account.address], { account: owner.account.address })
      ).to.be.revertedWith("Pool already whitelisted");
    });
  });

  describe("unwhitelistPool", function () {
    it("Should unwhitelist a pool", async function () {
      const { commonRedLobsterToken, owner, pool1 } = await loadFixture(deployCommonRedLobsterTokenFixture);

      await commonRedLobsterToken.write.whitelistPool([pool1.account.address], { account: owner.account.address });

      await expect(
        commonRedLobsterToken.write.unwhitelistPool([pool1.account.address], { account: owner.account.address })
      )
        .to.emit(commonRedLobsterToken, "PoolUnwhitelisted")
        .withArgs(getAddress(pool1.account.address));

      expect(await commonRedLobsterToken.read.isPoolWhitelisted([pool1.account.address])).to.be.false;
    });

    it("Should revert if called by non-owner", async function () {
      const { commonRedLobsterToken, owner, user, pool1 } = await loadFixture(deployCommonRedLobsterTokenFixture);

      await commonRedLobsterToken.write.whitelistPool([pool1.account.address], { account: owner.account.address });

      await expect(
        commonRedLobsterToken.write.unwhitelistPool([pool1.account.address], { account: user.account.address })
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should revert if pool is not whitelisted", async function () {
      const { commonRedLobsterToken, owner, pool1 } = await loadFixture(deployCommonRedLobsterTokenFixture);

      await expect(
        commonRedLobsterToken.write.unwhitelistPool([pool1.account.address], { account: owner.account.address })
      ).to.be.revertedWith("Pool is not whitelisted");
    });
  });

  describe("mintLobstersToPool", function () {
    it("Should mint lobsters to a whitelisted pool", async function () {
      const { commonRedLobsterToken, owner, pool1 } = await loadFixture(deployCommonRedLobsterTokenFixture);

      await commonRedLobsterToken.write.whitelistPool([pool1.account.address], { account: owner.account.address });

      const amount = 1000n;
      await expect(commonRedLobsterToken.write.mintLobstersToPool([amount], { account: pool1.account.address }))
        .to.emit(commonRedLobsterToken, "LobstersMinted")
        .withArgs(getAddress(pool1.account.address), amount);

      expect(await commonRedLobsterToken.read.balanceOf([pool1.account.address])).to.equal(amount);
    });

    it("Should revert if called by non-whitelisted address", async function () {
      const { commonRedLobsterToken, pool1 } = await loadFixture(deployCommonRedLobsterTokenFixture);

      await expect(
        commonRedLobsterToken.write.mintLobstersToPool([1000n], { account: pool1.account.address })
      ).to.be.revertedWith("Sender is not a whitelisted pool");
    });

    it("Should revert if amount is zero", async function () {
      const { commonRedLobsterToken, owner, pool1 } = await loadFixture(deployCommonRedLobsterTokenFixture);

      await commonRedLobsterToken.write.whitelistPool([pool1.account.address], { account: owner.account.address });

      await expect(
        commonRedLobsterToken.write.mintLobstersToPool([0n], { account: pool1.account.address })
      ).to.be.revertedWith("Amount must be greater than zero");
    });
  });

  describe("isPoolWhitelisted", function () {
    it("Should return true for whitelisted pools", async function () {
      const { commonRedLobsterToken, owner, pool1 } = await loadFixture(deployCommonRedLobsterTokenFixture);

      await commonRedLobsterToken.write.whitelistPool([pool1.account.address], { account: owner.account.address });

      expect(await commonRedLobsterToken.read.isPoolWhitelisted([pool1.account.address])).to.be.true;
    });

    it("Should return false for non-whitelisted pools", async function () {
      const { commonRedLobsterToken, pool1 } = await loadFixture(deployCommonRedLobsterTokenFixture);

      expect(await commonRedLobsterToken.read.isPoolWhitelisted([pool1.account.address])).to.be.false;
    });
  });
});
