import React, { useState } from "react";
import WalletConnect from "./WalletConnect";
import Image from "next/image";
import { FaHome, FaBookOpen, FaTrophy, FaGithub } from "react-icons/fa";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "https://lobsterfishingleague.com", icon: <FaHome /> },
    // { name: "Guidebook", href: "#", icon: <FaBookOpen /> },
    // { name: "Leaderboard", href: "#", icon: <FaTrophy /> },
    { name: "GitHub", href: "https://github.com/galleonlabs/lobster-fishing-league", icon: <FaGithub /> },
  ];

  return (
    <nav className="bg-gradient-to-r from-primary-dark to-primary text-white py-4 px-4 rounded-b-xl shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Image
              src="/lobster.png"
              alt="Lobster Fishing League"
              width={40}
              height={40}
              className="rounded-full mr-2"
            />
            <h1 className="text-2xl font-bold">Lobster Fishing League</h1>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-1 hover:text-secondary-light transition duration-300"
              >
                {item.icon}
                <span>{item.name}</span>
              </a>
            ))}
            <WalletConnect />
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus:outline-none hover:text-secondary-light transition duration-300"
            >
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
          <div className="mt-4 md:hidden bg-primary-light rounded-lg p-4 shadow-inner">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center space-x-2 py-2 px-4 hover:bg-primary rounded transition duration-300"
              >
                {item.icon}
                <span>{item.name}</span>
              </a>
            ))}
            <div className="mt-4 px-4">
              <WalletConnect />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
