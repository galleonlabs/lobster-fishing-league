import type { Metadata } from "next";
import { NEXT_PUBLIC_URL } from "../config";
import "./global.css";
import "@coinbase/onchainkit/styles.css";
import "@rainbow-me/rainbowkit/styles.css";
import dynamic from "next/dynamic";

const OnchainProviders = dynamic(() => import("src/components/OnchainProviders"), {
  ssr: false,
});

export const viewport = {
  width: "device-width",
  initialScale: 1.0,
};

export const metadata: Metadata = {
  title: "Lobster Fishing League",
  description: "Relax with friends and catch lobsters together.",
  openGraph: {
    title: "Lobster Fishing League",
    description: "Relax with friends and catch lobsters together.",
    images: [`${NEXT_PUBLIC_URL}/lobster.png`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html className="dark" lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet"/>
      </head>
      <body className="flex items-center justify-center">
        <OnchainProviders>{children}</OnchainProviders>
      </body>
    </html>
  );
}
