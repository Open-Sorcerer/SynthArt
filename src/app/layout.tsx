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
            <div className='w-full h-full flex flex-col justify-start gap-2 items-start'>
              <div className='w-full flex flex-row justify-between items-center p-3'>
                <div>NextJS-ConnectKit-Boilerplate</div>
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
