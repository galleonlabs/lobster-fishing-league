// import { expect } from "chai";
// import { loadFixture, time } from "@nomicfoundation/hardhat-network-helpers";
// import {  getAddress} from "viem";
// import hre from "hardhat";

// describe("WeatherReport", function () {
//   async function deployWeatherReportFixture() {
//     const [manager, user] = await hre.viem.getWalletClients();
//     const publicClient = await hre.viem.getPublicClient();

//     const mockVRFCoordinator = await hre.viem.deployContract("MockVRFCoordinatorV2Plus");

//     const SUBSCRIPTION_ID = 1n;
//     const GAS_LANE = "0x5d8f494125aa8b4521ae8ef63f704b0b1cd2e5b503f85c0e756bd5a3431adc6c";
//     const CALLBACK_GAS_LIMIT = 100000n;

//     const weatherReport = await hre.viem.deployContract("WeatherReport", [
//       mockVRFCoordinator.address,
//       SUBSCRIPTION_ID,
//       GAS_LANE,
//       CALLBACK_GAS_LIMIT,
//       manager.account.address,
//     ]);

//     return {
//       weatherReport,
//       mockVRFCoordinator,
//       manager,
//       user,
//       SUBSCRIPTION_ID,
//       GAS_LANE,
//       CALLBACK_GAS_LIMIT,
//       publicClient,
//     };
//   }

//   describe("Deployment", function () {
//     it("Should set the right manager", async function () {
//       const { weatherReport, manager } = await loadFixture(deployWeatherReportFixture);
//       expect(await weatherReport.read.manager()).to.equal(getAddress(manager.account.address));
//     });

//     it("Should initialize with GOOD weather, max expiration time, and no active report", async function () {
//       const { weatherReport } = await loadFixture(deployWeatherReportFixture);

//       const [condition, expirationTime] = await weatherReport.read.getCurrentWeather();
//       expect(condition).to.equal(1n); // GOOD weather
//       expect(expirationTime).to.equal(BigInt(2 ** 256) - BigInt(1));

//       expect(await weatherReport.read.hasActiveReport()).to.be.false;
//     });
//   });

//   describe("reportWeather", function () {
//     it("Should only allow manager to report weather", async function () {
//       const { weatherReport, user } = await loadFixture(deployWeatherReportFixture);

//       await expect(weatherReport.write.reportWeather({ account: user.account })).to.be.rejectedWith("revert");
//     });

//     it("Should request random words from VRF Coordinator", async function () {
//       const { weatherReport, mockVRFCoordinator, manager } = await loadFixture(deployWeatherReportFixture);

//       await weatherReport.write.reportWeather({ account: manager.account });

//       const requestId = await mockVRFCoordinator.read.nextRequestId();
//       expect(requestId).to.equal(2n); // First request ID is 1, so next should be 2
//     });

//     it("Should emit WeatherUpdateRequested event", async function () {
//       const { weatherReport, manager, publicClient } = await loadFixture(deployWeatherReportFixture);

//       const tx = await weatherReport.write.reportWeather({ account: manager.account });
//       const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });

//       const events = await weatherReport.getEvents.WeatherUpdateRequested({
//         fromBlock: receipt.blockNumber,
//         toBlock: receipt.blockNumber,
//       });
//       expect(events.length).to.equal(1);
//       expect(events[0].args.requestId).to.be.greaterThan(0n);
//     });
//   });

//   describe("fulfillRandomWords", function () {
//     it("Should update weather condition, expiration time, and set hasActiveReport to true", async function () {
//       const { weatherReport, mockVRFCoordinator, manager, publicClient } = await loadFixture(
//         deployWeatherReportFixture
//       );

//       await weatherReport.write.reportWeather({ account: manager.account });

//       const requestId = 1n;
//       const randomWords = [50n, 6n]; // This should result in GOOD weather and 10 hours duration

//       const tx = await mockVRFCoordinator.write.fulfillRandomWords([requestId, randomWords]);
//       const receipt = await publicClient.waitForTransactionReceipt({ hash: tx });

//       const events = await weatherReport.getEvents.WeatherUpdated({
//         fromBlock: receipt.blockNumber,
//         toBlock: receipt.blockNumber,
//       });
//       expect(events.length).to.equal(1);
//       expect(events[0].args.requestId).to.equal(requestId);
//       expect(events[0].args.newWeather).to.equal(1n); // GOOD weather

//       const [condition, expirationTime] = await weatherReport.read.getCurrentWeather();
//       expect(condition).to.equal(1n); // GOOD weather

//       const currentTimestamp = BigInt((await publicClient.getBlock({ blockTag: "latest" })).timestamp);
//       expect(expirationTime).to.be.closeTo(currentTimestamp + 10n * 3600n, 5n); // Allow 5 seconds tolerance

//       expect(await weatherReport.read.hasActiveReport()).to.be.true;
//     });
//   });

//   describe("getCurrentWeather", function () {
//     it("Should return GOOD weather and max expiration time when no active report", async function () {
//       const { weatherReport } = await loadFixture(deployWeatherReportFixture);

//       const [condition, expirationTime] = await weatherReport.read.getCurrentWeather();
//       expect(condition).to.equal(1n); // GOOD weather
//       expect(expirationTime).to.equal(BigInt(2 ** 256) - BigInt(1));
//     });

//     it("Should return current weather and expiration time when active report exists", async function () {
//       const { weatherReport, mockVRFCoordinator, manager } = await loadFixture(deployWeatherReportFixture);

//       await weatherReport.write.reportWeather({ account: manager.account });
//       await mockVRFCoordinator.write.fulfillRandomWords([1n, [90n, 8n]]); // EXCELLENT weather, 12 hours

//       const [condition, expirationTime] = await weatherReport.read.getCurrentWeather();
//       expect(condition).to.equal(2n); // EXCELLENT weather
//       expect(expirationTime).to.be.gt(0n);
//     });

//     it("Should return GOOD weather and max expiration time when active report has expired", async function () {
//       const { weatherReport, mockVRFCoordinator, manager } = await loadFixture(deployWeatherReportFixture);

//       await weatherReport.write.reportWeather({ account: manager.account });
//       await mockVRFCoordinator.write.fulfillRandomWords([1n, [90n, 4n]]); // EXCELLENT weather, 8 hours

//       await time.increase(9 * 3600); // Advance time by 9 hours

//       const [condition, expirationTime] = await weatherReport.read.getCurrentWeather();
//       expect(condition).to.equal(1n); // GOOD weather
//       expect(expirationTime).to.equal(BigInt(2 ** 256) - BigInt(1));
//     });
//   });
// });
