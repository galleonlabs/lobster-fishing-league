import React, { useState } from "react";
import WalletConnect from "./WalletConnect";
import Image from "next/image";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav
      className="bg-primary-dark text-white py-4 px-4 rounded-b-xl
    "
    >
      <div className="container mx-auto px-4 ">
        <div className="flex justify-between items-center">
          <div className="flex items-center ">
            <h1 className="text-2xl font-bold">Lobster Fishing League</h1>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <WalletConnect />
          </div>
          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="focus:outline-none">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="mt-4 md:hidden">
            <a href="#" className="block py-2 hover:text-secondary-light transition duration-300">
              Home
            </a>
            <a href="#" className="block py-2 hover:text-secondary-light transition duration-300">
              About
            </a>
            <a href="#" className="block py-2 hover:text-secondary-light transition duration-300">
              Leaderboard
            </a>
            <div className="mt-2">
              <WalletConnect />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
