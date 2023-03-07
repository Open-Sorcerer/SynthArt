"use client";
import {
  ConnectKitButton,
  ConnectKitProvider,
  getDefaultClient,
} from "connectkit";
import { Inter } from "next/font/google";
import Image from "next/image";
import { WagmiConfig, configureChains, createClient } from "wagmi";
import { fantom, fantomTestnet } from "wagmi/chains";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { publicProvider } from "wagmi/providers/public";
import styles from "./page.module.css";

import { usePrepareContractWrite, useAccount, useContractWrite } from "wagmi";
import ABI from "../contracts/ABI.json";

const contractAddress = "0xA4CCEb9e84b9682ca559AA41DB57f4BECe586dc5";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { address } = useAccount();

  const prepareContractWrite = usePrepareContractWrite({
    address: contractAddress,
    abi: ABI,
    functionName: "safeMint",
    args: [address, "METADATA_URL"],
  });

  const contractWrite = useContractWrite(prepareContractWrite.config);

  const handleSendTransation = () => {
    contractWrite.write?.();
  };

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <div>
          <button onClick={handleSendTransation}>Mint</button>
        </div>
      </div>
    </main>
  );
}
