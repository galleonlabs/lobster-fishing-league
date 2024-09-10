# Lobster Fishing League 🦞🎣

Welcome to the Lobster Fishing League, a decentralized fishing game built on the Base blockchain!

## Table of Contents
- [Lobster Fishing League 🦞🎣](#lobster-fishing-league-)
  - [Table of Contents](#table-of-contents)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Contract Overview](#contract-overview)
  - [How It Works](#how-it-works)
  - [Getting Started](#getting-started)
  - [Contract Details](#contract-details)
    - [CommonRedLobsterToken (CRL)](#commonredlobstertoken-crl)
    - [LobsterPotNFT](#lobsterpotnft)
    - [FishingSpot](#fishingspot)
  - [Deployment](#deployment)
  - [Frontend](#frontend)
  - [Development](#development)
  - [Future Roadmap](#future-roadmap)
  - [Contributing](#contributing)
  - [Security](#security)
  - [Connect With Us](#connect-with-us)
  - [License](#license)

## Introduction

Lobster Fishing League is an on-chain game where players can mint Lobster Pots, catch Common Red Lobsters, and participate in various fishing activities. The game is built on the Base blockchain, leveraging the power of smart contracts to create a transparent and fun gaming experience.

## Features

- Mint unique Lobster Pot NFTs
- Fish for Common Red Lobsters (ERC20 tokens)
- Cooldown mechanics for balanced gameplay
- Expandable system for new equipment, lobster types, and fishing spots
- Fully on-chain gameplay logic

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
5. Players can trade their CRL tokens or use them in future game expansions.

## Getting Started

To start playing:

1. Connect your wallet to the [Lobster Fishing League dApp](https://lobsterfishingleague.com).
2. Ensure you have some ETH on the Base network for gas fees and minting.
3. Mint a LobsterPotNFT from the dApp interface.
4. Navigate to a FishingSpot and start fishing!
5. Wait for the cooldown period between fishing attempts.
6. Collect your CRL tokens and watch your balance grow!

## Contract Details

### CommonRedLobsterToken (CRL)

- **Purpose**: Represents caught lobsters as ERC20 tokens.
- **Features**:
  - Minting controlled by whitelisted FishingSpot contracts.
  - Standard ERC20 functionality for transfers and approvals.
  - Ability to whitelist new fishing spots for ecosystem expansion.

### LobsterPotNFT

- **Purpose**: Represents fishing equipment as ERC721 tokens.
- **Features**:
  - Minting with a fixed price.
  - Required to fish at FishingSpot locations.
  - Unique tokenURI for each Lobster Pot.
  - Ability to update image URI for all tokens.

### FishingSpot

- **Purpose**: Main game contract where fishing takes place.
- **Features**:
  - Fishing functionality with cooldown period.
  - Baiting mechanism to replenish lobster population.
  - Interaction with LobsterPotNFT and CommonRedLobsterToken contracts.
  - Random number generation for fishing success probability.

## Deployment

The contracts are deployed on the Base blockchain:

- CommonRedLobsterToken: `0xbC69A9e8768746C6E9A4Cf619E0e441EF40E9ba9`
- LobsterPotNFT: `0x721552FdBB7419554Db03C694f22f2a7DAeFad3C`
- FishingSpot: `0x3411c7A63025D40863280a4790fB57308bd34550`

To interact with these contracts, you can use the ABI files provided in the `abis/` directory.

## Frontend

Our frontend is built using Next.js and ethers.js. It provides an intuitive interface for players to interact with the game contracts. Key features include:

- Responsive design for both desktop and mobile devices
- Real-time balance updates
- Interactive fishing mechanics
- Wallet connection and network switching support

## Development

To set up the project locally:

1. Clone the repository:
   ```
   git clone https://github.com/galleonlabs/lobster-fishing-league.git
   ```
2. Install dependencies:
   ```
   cd lobster-fishing-league
   npm install
   ```
3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Fill in the required variables (API keys, RPC URLs, etc.)
4. Run the development server:
   ```
   npm run dev
   ```

## Future Roadmap

We have exciting plans for the future of Lobster Fishing League:

- Introduce rare lobster species with unique attributes
- Implement advanced fishing equipment for varied gameplay
- Create specialized fishing pools for different lobster types
- Organize fishing tournaments with exclusive rewards
- Develop a decentralized marketplace for lobster trading
- Implement a breeding system for creating hybrid lobsters

## Contributing

We welcome contributions from the community! If you'd like to contribute:

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to your branch
5. Open a pull request

Please read our [CONTRIBUTING.md](CONTRIBUTING.md) file for more details on our code of conduct and development process.

## Security

If you discover any security-related issues, please email security@lobsterfishingleague.com instead of using the issue tracker. We take all security concerns seriously.

## Connect With Us

- Website: [https://lobsterfishingleague.com](https://lobsterfishingleague.com)
- Twitter: [@GalleonLabs](https://twitter.com/galleonlabs)
- Discord: [Join our community](https://discord.gg/EHECwm6Zrj)
- GitHub: [Galleon Labs](https://github.com/galleonlabs/lobster-fishing-league)

For any queries or support, please open an issue in this repository or reach out to us on Discord.

## License

Lobster Fishing League is open-sourced software licensed under the [MIT license](LICENSE.md).

Happy Fishing! 🎣🦞