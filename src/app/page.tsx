"use client";
import HamsterLoader from "@/components/HamsterLoader";
import SplineObject from "@/components/SplineObject";
import { Inter } from "next/font/google";

import { useState } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import ABI from "../contracts/ABI.json";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { Configuration, OpenAIApi } from "openai";
const contractAddress = "0xA4CCEb9e84b9682ca559AA41DB57f4BECe586dc5";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { address, isConnected } = useAccount();

  const [name, setName] = useState<string | null>("Your AI Mint");
  const [desc, setDesc] = useState<string | null>("Your AI Mint");
  const [metadata, setMetadata] = useState<string | null>("");
  const [image, setImage] = useState<string>("./out.png");
  const [loading, setLoading] = useState<number>(0);
  const [disabled, setDisabled] = useState<boolean>(true);
  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });

  const openai = new OpenAIApi(configuration);

  const createImage = async () => {
    console.log("Creating Image");
    setLoading(1);
    try {
      const response = await openai.createImage({
        prompt: desc!,
        n: 1,
        size: "1024x1024",
      });
      console.log(response);
      const image_url = response.data.data[0].url;
      console.log(image_url);
      setImage(image_url!);
      setLoading(0);
      setDisabled(false);
      return image_url;
    } catch (e) {
      console.log(e);
    }
  };

  const uploading = async (e: any) => {
    console.log(e);
    setLoading(2);
    const storage = new ThirdwebStorage();
    const url = await storage.upload(e);
    console.log(url);
    setLoading(0);
    return url;
  };

  const prepareContractWrite = usePrepareContractWrite({
    address: contractAddress,
    abi: ABI,
    functionName: "safeMint",
    args: [address, metadata],
  });
  const { data, isLoading, isSuccess, writeAsync } = useContractWrite(
    prepareContractWrite.config
  );

  const handleSendTransaction = async () => {
    var data = JSON.stringify({
      name: name,
      description: { desc }["desc"],
      image: image,
      mint_to_address: { address }["address"],
    });

    const metadata = await uploading(data);
    setMetadata(metadata);
    console.log(metadata);

    await writeAsync?.().then((res) => {
      alert("Minted Successfully");

      console.log(res.hash);
      // showcase the transaction hash
      // append the transaction hash to the url
      // url = https://testnet.ftmscan.com/tx/${res.hash}
    });

    console.log(data);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between items-center py-10">
      <SplineObject scene="https://prod.spline.design/LM16YpEsPBwXzoug/scene.splinecode" />
      {isConnected && (
        <div className="w-full h-4/5 flex flex-row bg-black/20 md:w-2/3 gap-5 p-10 rounded-md z-1 fixed">
          <div className="w-full h-full flex flex-col gap-5 justify-evenly text-lg">
            <h1 className="text-5xl font-semibold text-white">SynthArt</h1>
            <input
              className="px-5 py-3 rounded-lg mt-0 text-gray-800 shadow-sm placeholder:text-gray-500 placeholder:dark:text-gray-200 dark:text-white"
              id="name"
              name="name"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
            <textarea
              className="px-5 py-3 rounded-lg mt-0 text-gray-800 shadow-sm placeholder:text-gray-500 placeholder:dark:text-gray-200 dark:text-white"
              id="desc"
              name="desc"
              rows={8}
              placeholder="Description"
              onChange={(e) => setDesc(e.target.value)}
            />
            <button
              className="bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg"
              onClick={() => {
                createImage();
              }}
            >
              Generate AI Art
            </button>
            {/* <button onClick={awesome}>Tester</button> */}
            <button
              className="bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg"
              onClick={handleSendTransaction}
              disabled={disabled}
            >
              Forge
            </button>
          </div>
          <img src={image!} alt="ai-art" />
        </div>
      )}
      {loading === 1 && (
        <div className="w-1/3 h-1/3 flex justify-center items-center absolute top-1/3 left-1/3 z-10">
          <HamsterLoader loaderTitle="Forging the Image" />
        </div>
      )}
      {loading === 2 && (
        <div className="w-1/3 h-1/3 flex justify-center items-center absolute top-1/3 left-1/3 z-10">
          <HamsterLoader loaderTitle="Uploading to IPFS" />
        </div>
      )}
    </div>
  );
}
