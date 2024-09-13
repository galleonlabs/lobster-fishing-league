// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/vrf/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBaseV2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IWeatherReport.sol";

contract WeatherReport is IWeatherReport, VRFConsumerBaseV2, Ownable {
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint256 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 2;

    WeatherCondition public currentWeather;
    uint256 public weatherExpirationTime;
    bool public hasActiveReport;

    constructor(
        address _vrfCoordinator,
        uint256 _subscriptionId, 
        bytes32 _gasLane,
        uint32 _callbackGasLimit
    ) VRFConsumerBaseV2(_vrfCoordinator) Ownable(msg.sender) {
        i_vrfCoordinator = VRFCoordinatorV2Interface(_vrfCoordinator);
        i_subscriptionId = _subscriptionId;
        i_gasLane = _gasLane;
        i_callbackGasLimit = _callbackGasLimit;
        currentWeather = WeatherCondition.GOOD;
        weatherExpirationTime = type(uint256).max;
        hasActiveReport = false;
    }

    function getCurrentWeather() external view override returns (WeatherCondition, uint256) {
        if (!hasActiveReport || block.timestamp > weatherExpirationTime) {
            return (WeatherCondition.GOOD, type(uint256).max);
        }
        return (currentWeather, weatherExpirationTime);
    }

 function reportWeather() external override onlyOwner {
        try i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            uint64(i_subscriptionId),
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        ) returns (uint256 requestId) {
            emit WeatherUpdateRequested(requestId);
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("VRF request failed: ", reason)));
        } catch (bytes memory lowLevelData) {
            revert(string(abi.encodePacked("VRF request failed with raw error: ", lowLevelData)));
        }
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        uint256 weatherRandom = randomWords[0] % 100;
        uint256 durationRandom = randomWords[1] % 9 + 4; // 4 to 12 hours
        
        if (weatherRandom < 20) {
            currentWeather = WeatherCondition.POOR;
        } else if (weatherRandom < 80) {
            currentWeather = WeatherCondition.GOOD;
        } else {
            currentWeather = WeatherCondition.EXCELLENT;
        }

        weatherExpirationTime = block.timestamp + durationRandom * 1 hours;
        hasActiveReport = true;

        emit WeatherUpdated(requestId, currentWeather, weatherExpirationTime);
    }
}