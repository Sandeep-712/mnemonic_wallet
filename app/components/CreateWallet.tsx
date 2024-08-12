"use client";

import { useState } from "react";
import { Keypair as SolanaKeypair } from "@solana/web3.js";
import { ethers } from "ethers";
import {
  createEthereumWalletFromMnemonic,
  createSolanaWalletFromMnemonic,
  generateMnemonic,
} from "@/utils/wallet";

export const CreateWallet = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [solWallets, setsolWallets] = useState<SolanaKeypair[]>([]);
  const [ethWallets, setethWallets] = useState<ethers.Wallet[]>([]);
  const [blockchain, setBlockchain] = useState<"solana" | "ethereum">(
    "ethereum"
  );
  const [mnemonicVisible, setMnemonicVisible] = useState(false);

  const handleGeneratemnemonic = (): void => {
    const newMnemonic = generateMnemonic();
    setMnemonic(newMnemonic);
    setsolWallets([]);
    setethWallets([]);
  };

  const handleAddwallet = (): void => {
    if (blockchain === "solana") {
      const newWallet = createSolanaWalletFromMnemonic(
        mnemonic,
        solWallets.length
      );
      setsolWallets([...solWallets, newWallet]);
    } else if (blockchain === "ethereum") {
      const newWallet = createEthereumWalletFromMnemonic(
        mnemonic,
        ethWallets.length
      );
      setethWallets([...ethWallets, newWallet]);
    }
  };

  const wallets = blockchain === "solana" ? solWallets : ethWallets;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="rounded-lg shadow-lg p-8 min-w-[700px] w-full">
        <h1 className="text-4xl font-extrabold mb-6 text-center text-white">
          Web3 Wallet
        </h1>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-200 mb-2">
            Select Blockchain
          </label>
          <select
            className="w-full px-4 py-2 text-gray-800 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) =>
              setBlockchain(e.target.value as "solana" | "ethereum")
            }
            value={blockchain}
          >
            <option value="ethereum">Ethereum</option>
            <option value="solana">Solana</option>
          </select>
        </div>
        <button
          className="w-full bg-blue-500 text-white rounded-lg py-3 px-6 hover:bg-blue-700 transition duration-300 mb-6"
          onClick={handleGeneratemnemonic}
        >
          Generate Mnemonic
        </button>

        {mnemonic && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Mnemonic
            </label>
            <div className="relative bg-gray-200 p-4 rounded-lg text-sm text-gray-800 break-words">
              <button
                type="button"
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={()=>setMnemonicVisible(!mnemonicVisible)}
              >
                {mnemonicVisible ? "Hide" : "Show"}
              </button>
              <div className="px-4 py-2">
                {mnemonicVisible ? mnemonic : "*".repeat(24)}
              </div>
            </div>
            <button
              className="w-full bg-blue-500 text-white rounded-lg py-3 px-6 hover:bg-blue-700 transition duration-300"
              onClick={handleAddwallet}
            >
              Add wallet
            </button>
          </div>
        )}

        {wallets.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-4 text-gray-400">
              Wallets ({blockchain})
            </h2>
            <ul className="space-y-3">
              {wallets.map((wallet, index) => (
                <li
                  key={index}
                  className="bg-gray-200 p-4 rounded-lg text-sm text-gray-800 break-words"
                >
                  Wallets {index + 1}:{" "}
                  {blockchain === "solana"
                    ? (wallet as SolanaKeypair)?.publicKey?.toString()
                    : (wallet as ethers.Wallet)?.address}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
