import "./globals.css";
import { Geist } from "next/font/google";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata = {
  title: "TheOneTrade — AI trading systems engineered against second-order chaos",
  description:
    "An AI-native trading agency for quant teams. Built on backtest-kit, LLM news sentiment, and Pine Script that runs anywhere.",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: "/apple-touch-icon.png",
  },
  appleWebApp: {
    capable: true,
    title: "TheOneTrade",
    statusBarStyle: "black-translucent",
  },
  themeColor: "#19d1c6",
  viewport: "width=device-width, initial-scale=1, viewport-fit=cover",
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "TheOneTrade",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" className={geist.variable}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
