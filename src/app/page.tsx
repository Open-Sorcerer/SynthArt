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
import { useState } from "react";

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

  const handleSendTransaction = () => {
    contractWrite.write?.();
  };


  const [name, setName] = useState<string | null>('');
  const [desc, setDesc] = useState<string | null>('');
  return (
    <main className='w-full h-full flex flex-col justify-between items-center p-10'>
      <form className='w-full h-full flex flex-col gap-5 bg-white/10 md:w-1/2 p-10 rounded-md'>
        <input
          className='p-3 rounded-full mt-0 text-gray-800 shadow-sm placeholder:text-gray-500 placeholder:dark:text-gray-200 dark:text-white'
          id="name"
          name="name"
          placeholder="Name"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className='p-3 rounded-full mt-0 text-gray-800 shadow-sm placeholder:text-gray-500 placeholder:dark:text-gray-200 dark:text-white'
          id="desc"
          name="desc"
          placeholder="Description"
          onChange={(e) => setDesc(e.target.value)}
        />
        <button onClick={handleSendTransaction}>Mint</button>
      </form>
    </main>
  );
}
