import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { getAddress, parseEther } from "viem";
import hre from "hardhat";

describe("FishingSpot", function () {
  async function deployFishingSpotFixture() {
    const [owner, user] = await hre.viem.getWalletClients();

    const lobsterPotNFT = await hre.viem.deployContract("LobsterPotNFT", [
      owner.account.address,
      "https://example.com/lobster.png",
    ]);
    const commonRedLobsterToken = await hre.viem.deployContract("CommonRedLobsterToken");
    const LOBSTER_AMOUNT = parseEther("1");

    const fishingSpot = await hre.viem.deployContract("FishingSpot", [
      lobsterPotNFT.address,
      commonRedLobsterToken.address,
      LOBSTER_AMOUNT,
    ]);

    // Whitelist the fishing spot in the CommonRedLobsterToken contract
    await commonRedLobsterToken.write.whitelistPool([fishingSpot.address], { account: owner.account });

    return { fishingSpot, lobsterPotNFT, commonRedLobsterToken, owner, user, LOBSTER_AMOUNT };
  }

  describe("Deployment", function () {
    it("Should set the correct equipment NFT address", async function () {
      const { fishingSpot, lobsterPotNFT } = await loadFixture(deployFishingSpotFixture);

      expect(getAddress(await fishingSpot.read.equipmentNFT())).to.equal(getAddress(lobsterPotNFT.address));
    });

    it("Should set the correct lobster token address", async function () {
      const { fishingSpot, commonRedLobsterToken } = await loadFixture(deployFishingSpotFixture);

      expect(getAddress(await fishingSpot.read.lobsterToken())).to.equal(getAddress(commonRedLobsterToken.address));
    });

    it("Should set the correct lobster amount", async function () {
      const { fishingSpot, LOBSTER_AMOUNT } = await loadFixture(deployFishingSpotFixture);

      expect(await fishingSpot.read.lobsterAmount()).to.equal(LOBSTER_AMOUNT);
    });
  });

  describe("Fishing", function () {
    it("Should allow fishing with equipment NFT", async function () {
      const { fishingSpot, lobsterPotNFT, commonRedLobsterToken, owner, user, LOBSTER_AMOUNT } = await loadFixture(
        deployFishingSpotFixture
      );

      // Mint a LobsterPot NFT for the user
      await lobsterPotNFT.write.mintEquipment({ account: user.account, value: parseEther("0.001") });

      // Bait the area with some lobsters
      await fishingSpot.write.baitArea([LOBSTER_AMOUNT * BigInt(10)], { account: owner.account });

      // Fish
      await fishingSpot.write.fish({ account: user.account });

      expect(await commonRedLobsterToken.read.balanceOf([user.account.address])).to.equal(LOBSTER_AMOUNT);
    });

    it("Should not allow fishing without equipment NFT", async function () {
      const { fishingSpot, user } = await loadFixture(deployFishingSpotFixture);

      await expect(fishingSpot.write.fish({ account: user.account })).to.be.rejectedWith(
        "You need a Lobster Pot NFT to fish"
      );
    });

    it("Should enforce cooldown period", async function () {
      const { fishingSpot, lobsterPotNFT, owner, user, LOBSTER_AMOUNT } = await loadFixture(deployFishingSpotFixture);

      // Mint a LobsterPot NFT for the user
      await lobsterPotNFT.write.mintEquipment({ account: user.account, value: parseEther("0.001") });

      // Bait the area with some lobsters
      await fishingSpot.write.baitArea([LOBSTER_AMOUNT * BigInt(10)], { account: owner.account });

      // Fish once
      await fishingSpot.write.fish({ account: user.account });

      // Try to fish again immediately
      await expect(fishingSpot.write.fish({ account: user.account })).to.be.rejectedWith(
        "Please wait for at least 1 minute before fishing again"
      );
    });
  });

  describe("Baiting", function () {
    it("Should allow owner to bait the area", async function () {
      const { fishingSpot, commonRedLobsterToken, owner, LOBSTER_AMOUNT } = await loadFixture(deployFishingSpotFixture);

      await fishingSpot.write.baitArea([LOBSTER_AMOUNT * BigInt(10)], { account: owner.account });

      expect(await commonRedLobsterToken.read.balanceOf([fishingSpot.address])).to.equal(LOBSTER_AMOUNT * BigInt(10));
    });

    it("Should not allow non-owner to bait the area", async function () {
      const { fishingSpot, user, LOBSTER_AMOUNT } = await loadFixture(deployFishingSpotFixture);

      await expect(
        fishingSpot.write.baitArea([LOBSTER_AMOUNT * BigInt(10)], { account: user.account })
      ).to.be.rejectedWith("OwnableUnauthorizedAccount");
    });
  });
});
