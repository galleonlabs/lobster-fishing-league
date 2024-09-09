import React from "react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="text-center py-10">
      <Image src="/lobster.png" alt="Lobster" width={120} height={120} className="mx-auto mb-8" />
      <h2 className="text-4xl font-bold mb-4 text-primary-dark">Welcome to the Lobster Fishing League</h2>
      <p className="text-xl text-text-light">
        Take some time out of your busy schedule and catch some onchain lobsters with friends.
      </p>
    </section>
  );
}
