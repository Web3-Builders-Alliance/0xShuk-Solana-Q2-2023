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

const imageUri = "https://arweave.net/MUzWWaqNm4JvWSEgtODI2MqI3g1ARC9KW6xcI-PKD_4";

(async() => {
    const metadataUri = await metaplex.nfts().uploadMetadata({
        name: "0xShuk Rug",
        description: "The proud owner of this rug",
        symbol: "SHK",
        image: imageUri,
        attributes: [
            {trait_type: 'Feature', value: 'Rainbow'},
            {trait_type: 'Style', value: 'Pixelated'},
            {trait_type: 'Background', value: 'Blue'}
        ],
        properties: {
            files: [
                {
                    type: "image/png",
                    uri: imageUri,
                },
            ]
        },
        creators: [
            {
              address: keypair.publicKey.toBase58(),
              share: 100
            }
        ]
    })

    console.log(metadataUri)
})()