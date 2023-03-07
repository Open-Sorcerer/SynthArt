'use client';
import { ConnectKitButton, ConnectKitProvider, getDefaultClient } from "connectkit";
import { Inter } from 'next/font/google';
import Image from 'next/image';
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { fantom, fantomTestnet } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { publicProvider } from "wagmi/providers/public";
import styles from './page.module.css';

// Choose which chains you'd like to show
const chains = [fantom, fantomTestnet];

const client = createClient(
  getDefaultClient({
    chains,
    appName: "Your App Name"
  }),
);

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <div>
          <WagmiConfig client={client}>
            <ConnectKitProvider>
              <ConnectKitButton />
            </ConnectKitProvider>
          </WagmiConfig>
        </div>
      </div>
    </main>
  )
}
