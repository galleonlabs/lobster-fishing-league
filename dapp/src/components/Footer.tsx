import React from "react";
import { DISCORD_LINK, GITHUB_LINK, ONCHAINKIT_LINK, TWITTER_LINK } from "src/links";
import { FaDiscord, FaGithub, FaTwitter, FaScroll } from "react-icons/fa";

const socialLinks = [
  { href: GITHUB_LINK, title: "Github", icon: <FaGithub /> },
  { href: DISCORD_LINK, title: "Discord", icon: <FaDiscord /> },
  { href: TWITTER_LINK, title: "X", icon: <FaTwitter /> },
];

export default function Footer() {
  return (
    <footer className="bg-primary-dark text-text py-8 rounded-t-sm px-8 border-t-4 border-secondary-dark">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h3 className="text-xl font-bold mb-2 text-white">Lobster Fishing League</h3>
            <p className="text-sm text-white">
              Crafted with 🦞 by{" "}
              <a
                href={TWITTER_LINK}
                target="_blank"
                rel="noreferrer"
                title="Galleon Labs"
                className="font-semibold hover:text-text transition duration-300"
              >
                Galleon Labs
              </a>
            </p>
          </div>
          <nav>
            <ul className="flex flex-wrap justify-center gap-4">
              {socialLinks.map(({ href, title, icon }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    title={title}
                    className="flex items-center gap-2 px-3 py-2 bg-primary-light rounded-sm hover:bg-primary transition duration-300 text-text hover:text-text-light"
                  >
                    {icon}
                    <span>{title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-8 pt-4 border-t border-primary-light text-center text-sm text-white">
          <p>
            &copy; {new Date().getFullYear()} Lobster Fishing League. All rights reserved by the Order of the Lobster.
          </p>
        </div>
      </div>
    </footer>
  );
}
