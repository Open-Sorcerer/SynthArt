"use client";
import {
  ConnectKitButton,
  ConnectKitProvider,
  getDefaultClient,
} from "connectkit";
import { WagmiConfig, createClient } from "wagmi";
import { fantom, fantomTestnet } from "wagmi/chains";
import "./globals.css";

// Choose which chains you'd like to show
const chains = [fantomTestnet];

const client = createClient(
  getDefaultClient({
    chains,
    appName: "Your App Name",
  })
);
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <WagmiConfig client={client}>
          <ConnectKitProvider>
            <ConnectKitButton />
            {children}
          </ConnectKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
