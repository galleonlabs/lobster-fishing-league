import React from "react";

export default function ComingSoon() {
  return (
    <section className="bg-white rounded-lg shadow-md p-8 mb-8">
      <h3 className="text-2xl font-bold mb-4 text-primary-dark">Coming Soon</h3>
      <p className="mb-4 text-text-light">
        Stay tuned for exciting new features and expansions to the Lobster Fishing League ecosystem:
      </p>
      <ul className="list-disc list-inside space-y-2 text-text-light">
        <li>
          <span className="font-semibold">Rare Lobster Species:</span> Discover and catch unique lobsters with varying
          rarity levels and special attributes.
        </li>
        <li>
          <span className="font-semibold">Advanced Fishing Equipment:</span> Upgrade your gear with new types of
          equipment designed to catch rarer lobsters and improve your fishing efficiency.
        </li>
        <li>
          <span className="font-semibold">Specialized Fishing Pools:</span> Explore new fishing spots tailored for
          specific lobster types and rarities.
        </li>
        <li>
          <span className="font-semibold">Fishing Tournaments:</span> Compete against other fishers in time-limited
          events for exclusive rewards and bragging rights.
        </li>
        <li>
          <span className="font-semibold">Leaderboards:</span> Track your fishing prowess and compare your catches with
          other players on global and local leaderboards.
        </li>
        <li>
          <span className="font-semibold">Lobster Grand Exchange:</span> Trade your caught lobsters in a decentralized
          marketplace, setting your own prices and discovering rare specimens.
        </li>
        <li>
          <span className="font-semibold">Lobster Breeding:</span> Combine different lobster species to create unique
          hybrids with special traits.
        </li>
        <li>
          <span className="font-semibold">Fishing Guilds:</span> Join or create fishing guilds to collaborate with other
          players and access exclusive guild-only fishing spots.
        </li>
      </ul>
    </section>
  );
}
