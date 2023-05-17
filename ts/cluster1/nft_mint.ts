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

const uri = "https://arweave.net/qi-YoUzAmnm5NUh7XvyDSJ_vpPS0mk9-I6VRikiSKEI";

(async() => {
    const mint = await metaplex.nfts().create({
        name: "0xShuk Rug",
        uri,
        symbol: "SHK",
        sellerFeeBasisPoints: 420,
        creators: [
            {
                address: keypair.publicKey,
                share: 100
            }
        ],
        isMutable: true
    })

    console.log(mint.nft.address.toBase58())
})()
