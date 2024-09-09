import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { getAddress, parseEther } from "viem";
import hre from "hardhat";

describe("LobsterPotNFT", function () {
  async function deployLobsterPotNFTFixture() {
    const [owner, user, developmentWallet] = await hre.viem.getWalletClients();
    const publicClient = await hre.viem.getPublicClient();

    const MINT_PRICE = parseEther("0.001");
    const IMAGE_URI = "https://example.com/lobster.png";

    const lobsterPotNFT = await hre.viem.deployContract("LobsterPotNFT", [
      developmentWallet.account.address,
      IMAGE_URI,
    ]);

    return { lobsterPotNFT, owner, user, developmentWallet, MINT_PRICE, IMAGE_URI, publicClient };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { lobsterPotNFT, owner } = await loadFixture(deployLobsterPotNFTFixture);

      expect(await lobsterPotNFT.read.owner()).to.equal(getAddress(owner.account.address));
    });

    it("Should set the correct development wallet", async function () {
      const { lobsterPotNFT, developmentWallet } = await loadFixture(deployLobsterPotNFTFixture);

      expect(await lobsterPotNFT.read.developmentWallet()).to.equal(getAddress(developmentWallet.account.address));
    });

    it("Should set the correct image URI", async function () {
      const { lobsterPotNFT, IMAGE_URI } = await loadFixture(deployLobsterPotNFTFixture);

      expect(await lobsterPotNFT.read.imageURI()).to.equal(IMAGE_URI);
    });
  });

  describe("Minting", function () {
    it("Should allow minting with correct payment", async function () {
      const { lobsterPotNFT, user, MINT_PRICE } = await loadFixture(deployLobsterPotNFTFixture);

      await lobsterPotNFT.write.mintEquipment({ account: user.account, value: MINT_PRICE });
      expect(await lobsterPotNFT.read.balanceOf([user.account.address])).to.equal(parseEther("1"));
    });

    it("Should not allow minting with incorrect payment", async function () {
      const { lobsterPotNFT, user } = await loadFixture(deployLobsterPotNFTFixture);

      await expect(
        lobsterPotNFT.write.mintEquipment({ account: user.account, value: parseEther("0.0005") })
      ).to.be.rejectedWith("Incorrect ETH amount sent");
    });
  });

  describe("Withdrawal", function () {
    it("Should allow development wallet to withdraw funds", async function () {
      const { lobsterPotNFT, user, developmentWallet, MINT_PRICE, publicClient } = await loadFixture(
        deployLobsterPotNFTFixture
      );

      await lobsterPotNFT.write.mintEquipment({ account: user.account, value: MINT_PRICE });
      const initialBalance = await publicClient.getBalance({ address: developmentWallet.account.address });
      await lobsterPotNFT.write.withdrawFunds({ account: developmentWallet.account });
      const finalBalance = await publicClient.getBalance({ address: developmentWallet.account.address });

      expect(finalBalance).to.be.greaterThan(initialBalance);
    });

    it("Should not allow non-development wallet to withdraw funds", async function () {
      const { lobsterPotNFT, user } = await loadFixture(deployLobsterPotNFTFixture);

      await expect(lobsterPotNFT.write.withdrawFunds({ account: user.account })).to.be.rejectedWith(
        "Only development wallet can withdraw funds"
      );
    });
  });
});
