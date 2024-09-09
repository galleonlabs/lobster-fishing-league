import React from "react";

const features = [
  {
    title: "Rare Lobster Species",
    description: "Discover and catch unique lobsters with varying rarity levels and special attributes.",
  },
  {
    title: "Advanced Fishing Equipment",
    description: "Upgrade your gear designed to catch rarer lobsters and improve your fishing efficiency.",
  },
  {
    title: "Specialized Fishing Pools",
    description: "Explore new fishing spots tailored for specific lobster types and rarities.",
  },
  {
    title: "Fishing Tournaments",
    description: "Compete against other fishers in time-limited events for exclusive rewards and bragging rights.",
  },
  {
    title: "Leaderboards",
    description:
      "Track your fishing prowess and compare your catches with other players on global and local leaderboards.",
  },
  {
    title: "Lobster Grand Exchange",
    description: "Trade your caught lobsters in a decentralized marketplace and discovering rare specimens.",
  },
  {
    title: "Lobster Breeding",
    description: "Combine different lobster species to create unique hybrids with special traits.",
  },
  {
    title: "Fishing Guilds",
    description: "Join or create fishing guilds to collaborate and access exclusive guild-only fishing spots.",
  },
];

export default function ComingSoon() {
  return (
    <section className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:p-8">
      <h3 className="text-2xl font-bold mb-4 text-primary-dark">Coming Soon</h3>
      <p className="mb-6 text-text-light">
        Stay tuned for exciting new features and expansions to the Lobster Fishing League ecosystem:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="bg-primary-light rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-lg mb-2 text-primary-dark">{feature.title}</h4>
            <p className="text-text-light">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
