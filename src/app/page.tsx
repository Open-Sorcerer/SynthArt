"use client";
import HamsterLoader from "@/components/HamsterLoader";
import SplineObject from "@/components/SplineObject";
import { Inter } from "next/font/google";
import Confetti from "react-confetti";
import { useState } from "react";
import {
  useAccount,
  useContractWrite,
  usePrepareContractWrite,
  useNetwork,
} from "wagmi";
import ABI from "../contracts/ABI.json";
import { ThirdwebStorage } from "@thirdweb-dev/storage";
import { Configuration, OpenAIApi } from "openai";
import Link from "next/link";
const contractAddresses = {
  997: "0x1a8784a45731F889D4a92258AE7E149d5C737AA1", // 5ire
  5001: "0x9B37654fc8d92cfdd3CF7bc8b507aefc34E795E0", // Mantle
  5: "0xA72e987B2c8e289C16FFb9107eF9942dB8872128", // Goerli
};

const explorerURLs = {
  997: "https://explorer.5ire.network/evm/tx/", // 5ire
  5001: "https://explorer.testnet.mantle.xyz/tx/", // Mantle
  5: "https://goerli.etherscan.io/tx/", // Goerli
};

// const contractAddress = "0x1a8784a45731F889D4a92258AE7E149d5C737AA1";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { chain } = useNetwork();

  const { address, isConnected } = useAccount();
  const [name, setName] = useState<string | null>("Your AI Mint");
  const [desc, setDesc] = useState<string | null>("Your AI Mint");
  const [metadata, setMetadata] = useState<string | null>("");
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState<number>(0);
  const [explosion, setExplosion] = useState<boolean>(false);
  const [disabled, setDisabled] = useState<boolean>(true);
  const [forged, setForged] = useState<string | null>(null);
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
      setDisabled(false);
      setForged(null);
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
    address: "0x1a8784a45731F889D4a92258AE7E149d5C737AA1",
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
      // 5ire chain URL = https://explorer.5ire.network/evm/tx/${res.hash}
      setForged(`https://explorer.5ire.network/evm/tx/${res.hash}`);
      setExplosion(true);
      setTimeout(function () {
        setExplosion(false);
      }, 5000);
    });
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
              Generate {!disabled && "new"} AI Art
            </button>
            {/* <button onClick={awesome}>Tester</button> */}
            {forged ? (
              <Link href={forged!}>
                <div className="bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg disabled:bg-gray-500 flex justify-center">
                  View on Block Explorer
                </div>
              </Link>
            ) : (
              <button
                className="bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg disabled:bg-gray-500"
                onClick={handleSendTransaction}
                disabled={disabled}
              >
                Forge
              </button>
            )}
          </div>
          <img
            src={image || "./out.png"}
            onLoad={() => setLoading(0)}
            alt="ai-art"
          />
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
      {explosion && <Confetti className="fullscreen" />}
    </div>
  );
}
