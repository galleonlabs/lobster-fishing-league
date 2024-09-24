// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";
import "./IWeatherReport.sol";

contract WeatherReport is VRFConsumerBaseV2Plus, IWeatherReport {
    using VRFV2PlusClient for VRFV2PlusClient.RandomWordsRequest;

    uint256 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane;
    uint32 private immutable i_callbackGasLimit;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 2;

    WeatherCondition public currentWeather;
    uint256 public weatherExpirationTime;
    bool public hasActiveReport;
    address public manager;

    constructor(
        address _vrfCoordinator,
        uint256 _subscriptionId,
        bytes32 _gasLane,
        uint32 _callbackGasLimit,
        address _manager
    ) VRFConsumerBaseV2Plus(_vrfCoordinator) {
        i_subscriptionId = _subscriptionId;
        i_gasLane = _gasLane;
        i_callbackGasLimit = _callbackGasLimit;
        currentWeather = WeatherCondition.GOOD;
        weatherExpirationTime = type(uint256).max;
        hasActiveReport = false;
        manager = _manager;
    }

    modifier onlyManager() {
        require(msg.sender == manager);
        _;
    }

    function getCurrentWeather()
        external
        view
        override
        returns (WeatherCondition, uint256)
    {
        if (!hasActiveReport || block.timestamp > weatherExpirationTime) {
            return (WeatherCondition.GOOD, type(uint256).max);
        }
        return (currentWeather, weatherExpirationTime);
    }

    function reportWeather() external override onlyManager {
        try
            IVRFCoordinatorV2Plus(s_vrfCoordinator).requestRandomWords(
                VRFV2PlusClient.RandomWordsRequest({
                    keyHash: i_gasLane,
                    subId: i_subscriptionId,
                    requestConfirmations: REQUEST_CONFIRMATIONS,
                    callbackGasLimit: i_callbackGasLimit,
                    numWords: NUM_WORDS,
                    extraArgs: VRFV2PlusClient._argsToBytes(
                        VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
                    )
                })
            )
        returns (uint256 requestId) {
            emit WeatherUpdateRequested(requestId);
        } catch Error(string memory reason) {
            revert(string(abi.encodePacked("VRF request failed: ", reason)));
        } catch (bytes memory lowLevelData) {
            revert(
                string(
                    abi.encodePacked(
                        "VRF request failed with raw error: ",
                        lowLevelData
                    )
                )
            );
        }
    }

    function fulfillRandomWords(
       uint256 _requestId,
        uint256[] calldata _randomWords
    ) internal override {
        uint256 weatherRandom = _randomWords[0] % 100;
        uint256 durationRandom = (_randomWords[1] % 9) + 4; // 4 to 12 hours

        if (weatherRandom < 20) {
            currentWeather = WeatherCondition.POOR;
        } else if (weatherRandom < 80) {
            currentWeather = WeatherCondition.GOOD;
        } else {
            currentWeather = WeatherCondition.EXCELLENT;
        }

        weatherExpirationTime = block.timestamp + durationRandom * 1 hours;
        hasActiveReport = true;

        emit WeatherUpdated(_requestId, currentWeather, weatherExpirationTime);
    }


}
