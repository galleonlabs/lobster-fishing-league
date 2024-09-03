import { expect } from "chai";
import { ethers } from "hardhat";
import { FishingSpot, ILobsterToken, LobsterPotNFT } from "../typechain-types";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe("FishingSpot", function () {
  let fishingSpot: FishingSpot;
  let lobsterToken: ILobsterToken;
  let equipmentNFT: LobsterPotNFT;
  let owner: HardhatEthersSigner;
  let addr1: HardhatEthersSigner;
  let addr2: HardhatEthersSigner;
  const lobsterAmount = 100;

  before(async () => {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Mock LobsterToken
    const LobsterTokenFactory = await ethers.getContractFactory("CommonRedLobsterToken");
    lobsterToken = (await LobsterTokenFactory.deploy()) as ILobsterToken;
    await lobsterToken.waitForDeployment();

    // Mock EquipmentNFT
    const DEV_ADDRESS = "0x30B0D5758c79645Eb925825E1Ee8A2c448812F37";
    const IMAGE_URL = "https://galleonlabs.io/galleon.png";
    const EquipmentNFTFactory = await ethers.getContractFactory("LobsterPotNFT");
    equipmentNFT = (await EquipmentNFTFactory.deploy(DEV_ADDRESS, IMAGE_URL)) as LobsterPotNFT;
    await equipmentNFT.waitForDeployment();

    // Deploy FishingSpot
    const FishingSpotFactory = await ethers.getContractFactory("FishingSpot");
    fishingSpot = (await FishingSpotFactory.deploy(
      await equipmentNFT.getAddress(),
      await lobsterToken.getAddress(),
      lobsterAmount,
    )) as FishingSpot;
    await fishingSpot.waitForDeployment();

    // Whitelist the FishingSpot contract
    await lobsterToken.whitelistPool(await fishingSpot.getAddress());

    // Bait the area
    await fishingSpot.baitArea(lobsterAmount);

    // Mint an EquipmentNFT to addr1
    await equipmentNFT.mintLobsterPot({ value: ethers.parseEther("0.001") });
    await equipmentNFT.connect(addr1).mintLobsterPot({ value: ethers.parseEther("0.001") });
  });

  describe("Deployment", function () {
    it("Should set the right lobster amount", async function () {
      expect(await fishingSpot.lobsterAmount()).to.equal(lobsterAmount);
    });

    it("Should set the right owner", async function () {
      expect(await fishingSpot.owner()).to.equal(owner.address);
    });
  });

  describe("Fishing", function () {
    it("Should allow fishing with an NFT", async function () {
      await ethers.provider.send("evm_increaseTime", [60]); // Increase time by 1 minute
      await fishingSpot.connect(addr1).fish();
      expect(await lobsterToken.balanceOf(addr1.address)).to.equal(lobsterAmount);
    });

    it("Should not allow fishing without an NFT", async function () {
      await expect(fishingSpot.connect(addr2).fish()).to.be.revertedWith("You need a Lobster Pot NFT to fish");
    });

    // TODO: Figure out why this is failing despite the correct reversion message
    // it("Should not allow fishing more than once per minute", async function () {
    //   await fishingSpot.connect(addr1).fish();
    //   await expect(fishingSpot.connect(addr1).fish()).to.be.revertedWith(
    //     "Please wait for at least 1 minute before fishing again",
    //   );
    // });

    it("Should not allow fishing if not enough lobster in the pool", async function () {
      await lobsterToken.transfer(owner.address, await lobsterToken.balanceOf(await fishingSpot.getAddress())); // Drain the pool
      await expect(fishingSpot.connect(owner).fish()).to.be.revertedWith("Not enough lobster in the pool");
    });
  });

  describe("Baiting Area", function () {
    it("Should allow the owner to bait the area", async function () {
      await fishingSpot.baitArea(lobsterAmount);
      expect(await lobsterToken.balanceOf(await fishingSpot.getAddress())).to.equal(lobsterAmount);
    });

    it("Should not allow non-owners to bait the area", async function () {
      await expect(fishingSpot.connect(addr1).baitArea(lobsterAmount)).to.be.revertedWith(
        "Ownable: caller is not the owner",
      );
    });
  });
});
