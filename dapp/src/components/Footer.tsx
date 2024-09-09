"use client";

import React from "react";
import { DISCORD_LINK, GITHUB_LINK, ONCHAINKIT_LINK, TWITTER_LINK } from "src/links";
import ArrowSvg from "src/svg/ArrowSvg";

const docLinks = [
  // { href: ONCHAINKIT_LINK, title: "Docs", icon: "📚" },
  { href: GITHUB_LINK, title: "Github", icon: "💻" },
  { href: DISCORD_LINK, title: "Discord", icon: "🎮" },
  { href: TWITTER_LINK, title: "X", icon: "🐦" },
];

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-white py-8 rounded-t-2xl px-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold mb-2">Lobster Fishing League</h3>
            <p className="text-sm text-primary-light">
              Built with ❤️ by{" "}
              <a
                href={TWITTER_LINK}
                target="_blank"
                rel="noreferrer"
                title="Galleon Labs"
                className="font-semibold hover:text-secondary-light transition duration-300"
              >
                Galleon Labs
              </a>
            </p>
          </div>
          <nav>
            <ul className="flex flex-wrap justify-center gap-4">
              {docLinks.map(({ href, title, icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    title={title}
                    className="flex items-center gap-2 px-3 py-2 bg-primary rounded-md hover:bg-primary-light transition duration-300"
                  >
                
                    <span>{title}</span>
             
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-8 pt-4 border-t border-primary-light text-center text-sm text-primary-light">
          <p>&copy; {new Date().getFullYear()} Lobster Fishing League. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
