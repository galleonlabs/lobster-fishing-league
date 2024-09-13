import { expect } from "chai";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";
import { getAddress } from "viem";
import hre from "hardhat";

describe("WeatherReport", function () {
  async function deployWeatherReportFixture() {
    const [owner, user] = await hre.viem.getWalletClients();
    const publicClient = await hre.viem.getPublicClient();

    // Mock VRF Coordinator
    const mockVRFCoordinator = await hre.viem.deployContract("MockVRFCoordinatorV2");

    const SUBSCRIPTION_ID = 1; // Use a simple number for testing
    const GAS_LANE = "0x5d8f494125aa8b4521ae8ef63f704b0b1cd2e5b503f85c0e756bd5a3431adc6c";
    const CALLBACK_GAS_LIMIT = 100000;

    const weatherReport = await hre.viem.deployContract("WeatherReport", [
      mockVRFCoordinator.address,
      SUBSCRIPTION_ID,
      GAS_LANE,
      CALLBACK_GAS_LIMIT,
    ]);

    return {
      weatherReport,
      mockVRFCoordinator,
      owner,
      user,
      SUBSCRIPTION_ID,
      GAS_LANE,
      CALLBACK_GAS_LIMIT,
      publicClient,
    };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { weatherReport, owner } = await loadFixture(deployWeatherReportFixture);

      expect(await weatherReport.read.owner()).to.equal(getAddress(owner.account.address));
    });

    it("Should initialize with GOOD weather and max expiration time", async function () {
      const { weatherReport } = await loadFixture(deployWeatherReportFixture);

      const [condition, expirationTime] = await weatherReport.read.getCurrentWeather();
      expect(condition).to.equal(1); // GOOD weather
      expect(expirationTime).to.equal(BigInt(2 ** 256 - 1)); // max uint256
    });
  });

  describe("reportWeather", function () {
    it("Should only allow owner to report weather", async function () {
      const { weatherReport, user } = await loadFixture(deployWeatherReportFixture);

      await expect(weatherReport.write.reportWeather({ account: user.account })).to.be.rejectedWith(
        "Ownable: caller is not the owner"
      );
    });

    it("Should request random words from VRF Coordinator", async function () {
      const { weatherReport, mockVRFCoordinator, owner, SUBSCRIPTION_ID, GAS_LANE, CALLBACK_GAS_LIMIT } =
        await loadFixture(deployWeatherReportFixture);

      await weatherReport.write.reportWeather({ account: owner.account });

      // Check if requestRandomWords was called on the mock VRF Coordinator
      const requests = await mockVRFCoordinator.read.getRequests();
      expect(requests.length).to.equal(1);
      expect(requests[0].keyHash).to.equal(GAS_LANE);
      expect(requests[0].subId).to.equal(SUBSCRIPTION_ID);
      expect(requests[0].callbackGasLimit).to.equal(CALLBACK_GAS_LIMIT);
    });
  });

  describe("fulfillRandomWords", function () {
    it("Should update weather condition and expiration time", async function () {
      const { weatherReport, mockVRFCoordinator, owner } = await loadFixture(deployWeatherReportFixture);

      await weatherReport.write.reportWeather({ account: owner.account });

      const requestId = 1; // Assuming this is the first request
      const randomWords = [50, 6]; // This should result in GOOD weather and 10 hours duration

      await mockVRFCoordinator.write.fulfillRandomWords([requestId, weatherReport.address, randomWords]);

      const [condition, expirationTime] = await weatherReport.read.getCurrentWeather();
      expect(condition).to.equal(1); // GOOD weather

      const currentTimestamp = BigInt((await publicClient.getBlock({ blockTag: "latest" })).timestamp);
      expect(expirationTime).to.be.closeTo(currentTimestamp + BigInt(10 * 3600), BigInt(5)); // Allow 5 seconds tolerance
    });
  });
});
