import React from "react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="text-center py-10 px-4 bg-gradient-to-b from-primary-light to-white rounded-xl shadow-md">
      <div className="max-w-4xl mx-auto">
        <div className="relative w-32 h-32 mx-auto mb-8">
          <Image src="/lobster.png" alt="Lobster" layout="fill" objectFit="contain" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-text">Lobster Fishing League</h2>
        <p className="text-lg sm:text-lg text-text-light max-w-2xl mx-auto">
          Take some time out of your busy schedule and catch some onchain lobsters with friends. Relax & enjoy.
        </p>
        {/* <div className="mt-8">
          <a
            href="#start-fishing"
            className="bg-primary-dark text-white px-6 py-3 rounded-full font-semibold hover:bg-opacity-90 transition duration-300 inline-block"
          >
            Start Fishing Now
          </a>
        </div> */}
      </div>
    </section>
  );
}
