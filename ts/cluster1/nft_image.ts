import {bundlrStorage, keypairIdentity, Metaplex, toMetaplexFile} from "@metaplex-foundation/js";
import { Keypair, Connection, Commitment, clusterApiUrl } from "@solana/web3.js";
import wallet from "../wba_wallet.json";
import fs from "fs";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const metaplex = Metaplex.make(connection).use(keypairIdentity(keypair)).use(bundlrStorage(
    {
        address: "https://devnet.bundlr.network",
        providerUrl: clusterApiUrl("devnet"),
        timeout: 600000
    }
));

(async() => {
    const imageBuffer = fs.readFileSync("../assets/generug.png");

    const metaplexImg = toMetaplexFile(imageBuffer, "art.png");

    const imageUri = await metaplex.storage().upload(metaplexImg);
    console.log(imageUri);
})()
