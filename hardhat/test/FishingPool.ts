// import { expect } from "chai";
// import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import { getAddress, parseEther } from "viem";
// import hre from "hardhat";

// describe("FishingSpot", function () {
//   const LOBSTER_AMOUNT = 1n;

//   async function deployFishingSpotFixture() {
//     const [owner, user] = await hre.viem.getWalletClients();

//     // Deploy mock contracts for IERC721 and ILobsterToken
//     const mockNFT = await hre.viem.deployContract("MockERC721", ["LobsterPot", "LPOT"]);
//     const mockLobsterToken = await hre.viem.deployContract("MockLobsterToken", ["LobsterToken", "LBST"]);

//     // Deploy FishingSpot contract
//     const fishingSpot = await hre.viem.deployContract("FishingSpot", [
//       mockNFT.address,
//       mockLobsterToken.address,
//       LOBSTER_AMOUNT,
//     ]);

//     return { fishingSpot, mockNFT, mockLobsterToken, owner, user };
//   }

//   describe("Deployment", function () {
//     it("Should set the correct NFT, token addresses and lobster amount", async function () {
//       const { fishingSpot, mockNFT, mockLobsterToken } = await loadFixture(deployFishingSpotFixture);

//       expect(await fishingSpot.read.equipmentNFT()).to.equal(getAddress(mockNFT.address));
//       expect(await fishingSpot.read.lobsterToken()).to.equal(getAddress(mockLobsterToken.address));
//       expect(await fishingSpot.read.lobsterAmount()).to.equal(LOBSTER_AMOUNT);
//     });

//     it("Should emit FishingSpotCreated event", async function () {
//       const { fishingSpot, mockNFT, mockLobsterToken } = await loadFixture(deployFishingSpotFixture);

//       await expect(fishingSpot.address).to.exist;
//     });
//   });

//   describe("fish", function () {
//     it("Should allow fishing with NFT and transfer tokens", async function () {
//       const { fishingSpot, mockNFT, mockLobsterToken, user } = await loadFixture(deployFishingSpotFixture);

//       // Mint NFT to user
//       await mockNFT.write.mint([user.account.address]);

//       // Mint tokens to FishingSpot contract
//       await mockLobsterToken.write.mint([fishingSpot.address, LOBSTER_AMOUNT * 2n]);

//       await expect(fishingSpot.write.fish({ account: user.account.address }))
//         .to.emit(fishingSpot, "SuccessfulFishing")
//         .withArgs(user.account.address, LOBSTER_AMOUNT);

//       expect(await mockLobsterToken.read.balanceOf([user.account.address])).to.equal(LOBSTER_AMOUNT);
//     });

//     it("Should revert if user doesn't have NFT", async function () {
//       const { fishingSpot, user } = await loadFixture(deployFishingSpotFixture);

//       await expect(fishingSpot.write.fish({ account: user.account.address })).to.be.revertedWith(
//         "You need a Lobster Pot NFT to fish"
//       );
//     });

//     it("Should revert if fishing too frequently", async function () {
//       const { fishingSpot, mockNFT, mockLobsterToken, user } = await loadFixture(deployFishingSpotFixture);

//       await mockNFT.write.mint([user.account.address]);
//       await mockLobsterToken.write.mint([fishingSpot.address, LOBSTER_AMOUNT * 2n]);

//       await fishingSpot.write.fish({ account: user.account.address });

//       await expect(fishingSpot.write.fish({ account: user.account.address })).to.be.revertedWith(
//         "Please wait for at least 1 minute before fishing again"
//       );
//     });

//     it("Should revert if not enough tokens in the pool", async function () {
//       const { fishingSpot, mockNFT, user } = await loadFixture(deployFishingSpotFixture);

//       await mockNFT.write.mint([user.account.address]);

//       await expect(fishingSpot.write.fish({ account: user.account.address })).to.be.revertedWith(
//         "Not enough lobster in the pool"
//       );
//     });
//   });

//   describe("baitArea", function () {
//     it("Should mint tokens to the pool", async function () {
//       const { fishingSpot, mockLobsterToken, owner } = await loadFixture(deployFishingSpotFixture);

//       const baitAmount = 1000n;

//       await expect(fishingSpot.write.baitArea([baitAmount], { account: owner.account.address }))
//         .to.emit(fishingSpot, "AreaBaited")
//         .withArgs(baitAmount);

//       expect(await mockLobsterToken.read.balanceOf([fishingSpot.address])).to.equal(baitAmount);
//     });

//     it("Should revert if called by non-owner", async function () {
//       const { fishingSpot, user } = await loadFixture(deployFishingSpotFixture);

//       await expect(fishingSpot.write.baitArea([1000n], { account: user.account.address })).to.be.revertedWith(
//         "Ownable: caller is not the owner"
//       );
//     });
//   });
// });
