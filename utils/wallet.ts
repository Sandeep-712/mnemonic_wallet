import * as bip39 from "bip39";
import { Keypair as SolanaKeypair } from "@solana/web3.js";
import { Wallet } from "ethers";
import { HDKey } from "micro-ed25519-hdkey";
import { HDNodeWallet } from "ethers";

export const generateMnemonic = (): string => {
    return bip39.generateMnemonic();
};


export const createSolanaWalletFromMnemonic = (mnemonic: string, index: number): SolanaKeypair => {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    // console.log("Seed:", seed.toString('hex'));

    const masterkeypair = HDKey.fromMasterSeed(seed);
    const path = `m/44'/501'/${index}'/0'`;

    const derivedKey = masterkeypair.derive(path).privateKey;

    if (derivedKey.length !== 32) {
        throw new Error('Derived key length is incorrect');
    }

    const keypair = SolanaKeypair.fromSeed(derivedKey);

    return keypair;
}


export const createEthereumWalletFromMnemonic = (mnemonic: string, index: number): Wallet => {
    const path = `m/44'/60'/0/0/${index}`;
    return deriveEthereumWallet(mnemonic, path);
}

export function deriveEthereumWallet(mnemonic: string, derivationPath: string): Wallet {
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    const hdNodeWallet = HDNodeWallet.fromSeed(seed);
    const childNode = hdNodeWallet.derivePath(derivationPath);

    return new Wallet(childNode.privateKey);
}