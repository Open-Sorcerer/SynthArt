'use client';
import { ConnectKitButton, ConnectKitProvider, getDefaultClient } from "connectkit";
import { Inter } from 'next/font/google';
import Image from 'next/image';
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { fantom, fantomTestnet } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { publicProvider } from "wagmi/providers/public";
import styles from './page.module.css';

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <div>
          
        </div>
      </div>
    </main>
  )
}
