import React from "react";
import { FaGem, FaTools, FaMapMarkedAlt, FaTrophy, FaChartLine, FaExchangeAlt, FaDna, FaUsers } from "react-icons/fa";

const features = [
  {
    title: "Rare Lobster Species",
    description: "Discover and capture unique lobsters with varying rarity levels and special attributes.",
    icon: <FaGem className="text-secondary-dark" />,
  },
  {
    title: "Advanced Fishing Equipment",
    description: "Upgrade your gear to catch rarer lobsters and improve your fishing efficiency.",
    icon: <FaTools className="text-primary-dark" />,
  },
  {
    title: "Specialized Fishing Pools",
    description: "Explore new fishing spots tailored for specific lobster types and rarities.",
    icon: <FaMapMarkedAlt className="text-secondary" />,
  },
  {
    title: "Fishing Tournaments",
    description: "Compete against other fishers in time-limited events for exclusive rewards and bragging rights.",
    icon: <FaTrophy className="text-secondary-dark" />,
  },
  {
    title: "Leaderboards",
    description:
      "Track your fishing prowess and compare your catches with other players on global and local leaderboards.",
    icon: <FaChartLine className="text-primary-dark" />,
  },
  {
    title: "Lobster Grand Exchange",
    description: "Trade your caught lobsters in a decentralized marketplace and discover rare specimens.",
    icon: <FaExchangeAlt className="text-secondary" />,
  },
  {
    title: "Lobster Breeding",
    description: "Combine different lobster species to create unique hybrids with special traits.",
    icon: <FaDna className="text-primary" />,
  },
  {
    title: "Fishing Guilds",
    description: "Join or create fishing guilds to collaborate and access exclusive guild-only fishing spots.",
    icon: <FaUsers className="text-primary-dark" />,
  },
];

export default function ComingSoon() {
  return (
    <section className="bg-white rounded-sm shadow-md p-6 mb-8 text-text">
      <h3 className="text-2xl font-bold mb-4 text-primary-dark">Coming Soon</h3>
      <p className="mb-6 text-text-light">
        The ancient scrolls foretell of grand adventures and mystical discoveries in the Lobster Fishing League:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white bg-opacity-80 rounded-sm p-4 shadow-inner border border-text transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <div className="flex items-center mb-2">
              <span>{feature.icon}</span>
              <h4 className="font-semibold text-lg ml-2 text-primary-dark">{feature.title}</h4>
            </div>
            <p className="text-text-light">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
