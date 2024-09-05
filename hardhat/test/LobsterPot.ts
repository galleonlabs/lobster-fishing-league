// import { expect } from "chai";
// import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
// import { getAddress, parseEther } from "viem";
// import hre from "hardhat";

// describe("LobsterPotNFT", function () {
//   const IMAGE_URL = "https://galleonlabs.io/galleon.png";
//   const NEW_IMAGE_URL = "https://newimage.com/image.png";
//   const MINT_PRICE = parseEther("0.001");

//   async function deployLobsterPotNFTFixture() {
//     const [owner, user, newDevWallet] = await hre.viem.getWalletClients();

//     const lobsterPotNFT = await hre.viem.deployContract("LobsterPotNFT", [owner.account.address, IMAGE_URL]);

//     return { lobsterPotNFT, owner, user, newDevWallet };
//   }

//   describe("Deployment", function () {
//     it("Should set the correct development wallet and image URI", async function () {
//       const { lobsterPotNFT, owner } = await loadFixture(deployLobsterPotNFTFixture);

//       expect(await lobsterPotNFT.read.developmentWallet()).to.equal(getAddress(owner.account.address));
//       expect(await lobsterPotNFT.read.imageURI()).to.equal(IMAGE_URL);
//     });
//   });

//   describe("mintLobsterPot", function () {
//     it("Should mint a new NFT when correct price is paid", async function () {
//       const { lobsterPotNFT, user } = await loadFixture(deployLobsterPotNFTFixture);

//       await lobsterPotNFT.write.mintLobsterPot({ value: MINT_PRICE, account: user.account.address });

//       expect(await lobsterPotNFT.read.balanceOf([user.account.address])).to.equal(1n);
//     });

//     it("Should revert when incorrect price is paid", async function () {
//       const { lobsterPotNFT, user } = await loadFixture(deployLobsterPotNFTFixture);

//       await expect(
//         lobsterPotNFT.write.mintLobsterPot({ value: parseEther("0.0005"), account: user.account.address })
//       ).to.be.revertedWith("Incorrect ETH amount sent");
//     });
//   });

//   describe("setDevelopmentWallet", function () {
//     it("Should update the development wallet", async function () {
//       const { lobsterPotNFT, owner, newDevWallet } = await loadFixture(deployLobsterPotNFTFixture);

//       await lobsterPotNFT.write.setDevelopmentWallet([newDevWallet.account.address], {
//         account: owner.account.address,
//       });

//       expect(await lobsterPotNFT.read.developmentWallet()).to.equal(getAddress(newDevWallet.account.address));
//     });

//     it("Should emit DevelopmentWalletUpdated event", async function () {
//       const { lobsterPotNFT, owner, newDevWallet } = await loadFixture(deployLobsterPotNFTFixture);

//       await expect(
//         lobsterPotNFT.write.setDevelopmentWallet([newDevWallet.account.address], { account: owner.account.address })
//       )
//         .to.emit(lobsterPotNFT, "DevelopmentWalletUpdated")
//         .withArgs(getAddress(owner.account.address), getAddress(newDevWallet.account.address));
//     });
//   });

//   describe("setImageURI", function () {
//     it("Should update the image URI", async function () {
//       const { lobsterPotNFT, owner } = await loadFixture(deployLobsterPotNFTFixture);

//       await lobsterPotNFT.write.setImageURI([NEW_IMAGE_URL], { account: owner.account.address });

//       expect(await lobsterPotNFT.read.imageURI()).to.equal(NEW_IMAGE_URL);
//     });

//     it("Should emit ImageURIUpdated event", async function () {
//       const { lobsterPotNFT, owner } = await loadFixture(deployLobsterPotNFTFixture);

//       await expect(lobsterPotNFT.write.setImageURI([NEW_IMAGE_URL], { account: owner.account.address }))
//         .to.emit(lobsterPotNFT, "ImageURIUpdated")
//         .withArgs(IMAGE_URL, NEW_IMAGE_URL);
//     });
//   });

//   describe("withdrawFunds", function () {
//     it("Should allow development wallet to withdraw funds", async function () {
//       const { lobsterPotNFT, owner, user } = await loadFixture(deployLobsterPotNFTFixture);

//       // Mint an NFT to add funds to the contract
//       await lobsterPotNFT.write.mintLobsterPot({ value: MINT_PRICE, account: user.account.address });

//       console.log("current dev wallet", await lobsterPotNFT.read.developmentWallet());

//       const pClient = await hre.viem.getPublicClient();
//       const initialBalance = await pClient.getBalance({ address: owner.account.address });
//       await lobsterPotNFT.write.withdrawFunds({ account: owner.account.address });
//       const finalBalance = await pClient.getBalance({ address: owner.account.address });

//       expect(finalBalance).to.be.gt(initialBalance);
//     });

//     it("Should revert if called by non-development wallet", async function () {
//       const { lobsterPotNFT, user } = await loadFixture(deployLobsterPotNFTFixture);

//       await expect(lobsterPotNFT.write.withdrawFunds({ account: user.account.address })).to.be.reverted;
//     });
//   });
// });
