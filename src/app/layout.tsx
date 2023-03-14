"use client";
import {
  ConnectKitButton,
  ConnectKitProvider,
  getDefaultClient,
} from "connectkit";
import { WagmiConfig, createClient } from "wagmi";
import "./globals.css";

// Choose which chains you'd like to show

const firechain = {
  id: 997,
  name: "5ire",
  network: "5ireChain",
  nativeCurrency: {
    decimals: 9,
    name: "5ire",
    symbol: "5ire",
  },
  rpcUrls: {
    default: { http: ["https://rpc-testnet.5ire.network"] },
    public: { http: ["https://rpc-testnet.5ire.network"] },
  },
  testnet: true,
};

const chains = [firechain];

const client = createClient(
  getDefaultClient({
    chains,
    appName: "SynthArt",
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
            <div className="w-full h-full flex flex-col justify-start gap-2 items-start">
              <div className="w-full flex flex-row justify-between items-center p-3 z-10 mx-auto bg-blue-200 bg-opacity-60 border-gray-200 px-2 sm:px-4 py-2.5 rounded dark:bg-gray-800 dark:bg-opacity-60 drop-shadow-lg dark:drop-shadow-[0_20px_35px_rgba(255,255,255,0.25)]">
                <div className="flex flex-row gap-3">
                  <img src="./logo.png" alt="logo" className="h-6 w-6" />
                  <p>AI-based NFT Minter</p>
                </div>
                <ConnectKitButton />
              </div>
              {children}
            </div>
          </ConnectKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}
