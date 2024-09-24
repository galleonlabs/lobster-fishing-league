// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./IFishingSpotV2.sol";
import "./IEquipmentNFT.sol";
import "./ILobsterToken.sol";
import "./IWeatherReport.sol";

contract FishingSpotV2 is IFishingSpotV2, Ownable, ReentrancyGuard {
    IERC721 public override equipmentNFT;
    ILobsterToken public override lobsterToken;
    uint256 public override lobsterAmount;
    mapping(address => uint256) public override lastFishingTime;
    IWeatherReport public weatherReport;

    constructor(
        address _equipmentNFT,
        address _lobsterToken,
        uint256 _lobsterAmount,
        address _weatherReport
    ) Ownable(msg.sender) {
        equipmentNFT = IERC721(_equipmentNFT);
        lobsterToken = ILobsterToken(_lobsterToken);
        lobsterAmount = _lobsterAmount;
        weatherReport = IWeatherReport(_weatherReport);
        lobsterToken.approve(address(this), type(uint256).max);

        emit FishingSpotCreated(_equipmentNFT, _lobsterToken, _lobsterAmount);
    }

    function fish() public override nonReentrant {
        require(
            equipmentNFT.balanceOf(msg.sender) > 0,
            "You need a Lobster Pot NFT to fish"
        );
        require(
            block.timestamp >= lastFishingTime[msg.sender] + 1 minutes,
            "Please wait for at least 1 minute before fishing again"
        );
        require(
            lobsterToken.balanceOf(address(this)) >= lobsterAmount * 2,
            "Not enough lobster in the pool"
        );

        lastFishingTime[msg.sender] = block.timestamp;

        (IWeatherReport.WeatherCondition condition, uint256 expirationTime) = weatherReport.getCurrentWeather();
        uint256 catchAmount = calculateCatch(condition);

        lobsterToken.transfer(msg.sender, catchAmount);
        emit SuccessfulFishing(msg.sender, catchAmount);

        if (block.timestamp > expirationTime) {
            emit WeatherExpired(condition);
        }
    }

    function calculateCatch(IWeatherReport.WeatherCondition condition) private view returns (uint256) {
        if (condition == IWeatherReport.WeatherCondition.EXCELLENT) {
            return lobsterAmount * 2; // 2x base yield
        } else if (condition == IWeatherReport.WeatherCondition.GOOD) {
            return lobsterAmount; // 1x base yield
        } else { // POOR weather
            return lobsterAmount / 2; // 0.5x base yield
        }
    }

    function baitArea(uint256 _amount) external override onlyOwner {
        lobsterToken.mintLobstersToPool(_amount);
        emit AreaBaited(_amount);
    }

    event WeatherExpired(IWeatherReport.WeatherCondition lastCondition);
}