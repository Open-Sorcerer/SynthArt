"use client";
import SplineObject from "@/components/SplineObject";
import { Inter } from "next/font/google";

import { useState } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import ABI from "../contracts/ABI.json";

const contractAddress = "0xA4CCEb9e84b9682ca559AA41DB57f4BECe586dc5";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { address, isConnected } = useAccount();

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
    <div className='w-full h-full flex flex-col justify-between items-center py-10'>
      <SplineObject scene='https://prod.spline.design/tfcra4szzFG8uSFH/scene.splinecode' />
      {isConnected &&
        <div className='w-full h-4/5 flex flex-row bg-black/20 md:w-2/3 gap-5 p-10 rounded-md z-1 fixed'>
          <div className='w-full h-full flex flex-col gap-5 justify-evenly text-lg'>
            <h1 className='text-5xl font-semibold text-white'>AI Minter</h1>
            <input
              className='px-5 py-3 rounded-lg mt-0 text-gray-800 shadow-sm placeholder:text-gray-500 placeholder:dark:text-gray-200 dark:text-white'
              id="name"
              name="name"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className='px-5 py-3 rounded-lg mt-0 text-gray-800 shadow-sm placeholder:text-gray-500 placeholder:dark:text-gray-200 dark:text-white'
              id="desc"
              name="desc"
              rows={8}
              placeholder="Description"
              onChange={(e) => setDesc(e.target.value)}
            />
            <button className='bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg' onClick={()=>{}}>Generate AI Art</button>
            <button className='bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg' onClick={handleSendTransaction}>Mint</button>
          </div>
          <img src='./out.png' alt='ai-art'/>
        </div>
      }
    </div>
  );
}
