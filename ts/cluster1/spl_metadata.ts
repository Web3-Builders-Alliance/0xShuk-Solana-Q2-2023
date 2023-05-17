import { Keypair, Connection, Commitment, PublicKey, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { createCreateMetadataAccountV3Instruction, CreateMetadataAccountArgsV3 } from "@metaplex-foundation/mpl-token-metadata";
import wallet from "../wba_wallet.json";

const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const mint = new PublicKey("BPTVwHoUrhTidfwTb8x8ScBe859uUhFtbRuLLEKsTtMq")

const token_metadata_program_id = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s')

const metadata_seeds = [
    Buffer.from('metadata'),
    token_metadata_program_id.toBytes(),
    mint.toBytes(),
];

const [metadata_pda, _bump] = PublicKey.findProgramAddressSync(metadata_seeds, token_metadata_program_id);

(async () => {
    try {
        // Start here
        const tx = new Transaction().add(
            createCreateMetadataAccountV3Instruction({
                metadata: metadata_pda,
                mint, 
                mintAuthority: keypair.publicKey,
                payer: keypair.publicKey,
                updateAuthority: keypair.publicKey
            }, {
                createMetadataAccountArgsV3: {
                    data: {
                        name: "0xShuk TOkens",
                        symbol: "SHK",
                        uri: "",
                        sellerFeeBasisPoints: 500,
                        collection: null,
                        creators: [
                            {address: keypair.publicKey, verified: true, share: 100}
                        ],
                        uses: null
                    },
                    isMutable: true,
                    collectionDetails: null
                }
            })
        );

        const txHash = await sendAndConfirmTransaction(connection, tx, [keypair]);

        console.log("Metadata Created: ", txHash);
    } catch(e) {
        console.error(`Oops, something went wrong: ${e}`)
    }
})();