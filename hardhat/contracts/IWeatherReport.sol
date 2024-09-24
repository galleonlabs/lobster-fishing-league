// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IWeatherReport {
    enum WeatherCondition { POOR, GOOD, EXCELLENT }

    function getCurrentWeather() external view returns (WeatherCondition, uint256);
    function reportWeather() external;

    event WeatherUpdateRequested(uint256 requestId);
    event WeatherUpdated(uint256 requestId, WeatherCondition newWeather, uint256 expirationTime);
    event CoordinatorUpdated(address indexed oldCoordinator, address indexed newCoordinator);
}