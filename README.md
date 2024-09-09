# Lobster Fishing League 🦞🎣

Welcome to the Lobster Fishing League, a decentralized fishing game built on the Base blockchain!

## Table of Contents
- [Introduction](#introduction)
- [Contract Overview](#contract-overview)
- [How It Works](#how-it-works)
- [Getting Started](#getting-started)
- [Contract Details](#contract-details)
- [Deployment](#deployment)
- [Frontend](#frontend)
- [Connect With Us](#connect-with-us)

## Introduction

Lobster Fishing League is an on-chain game where players can mint Lobster Pots, catch Common Red Lobsters, and participate in various fishing activities. The game is built on the Base blockchain, leveraging the power of smart contracts to create a transparent and fun gaming experience.

## Contract Overview

The game consists of three main smart contracts that are built on interfaces to allow for new types of contracts to be developed over time:

1. **CommonRedLobsterToken (CRL)**: An ERC20 token representing the Common Red Lobsters caught in the game.
2. **LobsterPotNFT**: An ERC721 token representing the Lobster Pots used for fishing.
3. **FishingSpot**: The main game contract where players can fish for lobsters.

## How It Works

1. Players mint a LobsterPotNFT to start playing.
2. With a LobsterPotNFT, players can fish at FishingSpot locations.
3. Successful fishing attempts reward players with CommonRedLobsterTokens (CRL).
4. FishingSpots are periodically baited with CRL tokens to maintain the lobster population.

## Getting Started

To start playing:

1. Connect your wallet to the [Lobster Fishing League dApp](https://lobsterfishingleague.com).
2. Mint a LobsterPotNFT.
3. Navigate to a FishingSpot and start fishing!

## Contract Details

### CommonRedLobsterToken (CRL)

- **Purpose**: Represents caught lobsters as ERC20 tokens.
- **Features**:
  - Minting controlled by whitelisted FishingSpot contracts.
  - Standard ERC20 functionality.

### LobsterPotNFT

- **Purpose**: Represents fishing equipment as ERC721 tokens.
- **Features**:
  - Minting with a fixed price.
  - Required to fish at FishingSpot locations.

### FishingSpot

- **Purpose**: Main game contract where fishing takes place.
- **Features**:
  - Fishing functionality with cooldown period.
  - Baiting mechanism to replenish lobster population.
  - Interaction with LobsterPotNFT and CommonRedLobsterToken contracts.

## Deployment

The contracts are deployed on the Base blockchain:

- CommonRedLobsterToken: `0xca413ec990295ca71824be7a0051b4610737c773`
- LobsterPotNFT: `0xefcae45bc663b01d5f3900409bc8f48b4f6ed534`
- FishingSpot: `0xe299626f8ce4ae54bfe90a960894afcf57cae5f9`

To interact with these contracts, you can use the ABI files provided in the `abis/` directory.

## Frontend

Our frontend is built using Next.js and ethers.js. It provides an intuitive interface for players to interact with the game contracts.

## Connect With Us

- Website: [https://lobsterfishingleague.com](https://lobsterfishingleague.com)
- Twitter: [@GalleonLabs](https://twitter.com/galleonlabs)
- Discord: [Join our community](https://discord.gg/EHECwm6Zrj)
- GitHub: [Galleon Labs](https://github.com/galleonlabs/lobster-fishing-league)

For any queries or support, please open an issue in this repository or reach out to us on Discord.

Happy Fishing! 🎣🦞
