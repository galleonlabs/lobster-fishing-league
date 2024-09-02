"use client";

import type { NextPage } from "next";
import FishingDapp from "~~/components/FishingDapp";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-center flex-col flex-grow pt-10">
        <FishingDapp />
      </div>
    </>
  );
};

export default Home;
