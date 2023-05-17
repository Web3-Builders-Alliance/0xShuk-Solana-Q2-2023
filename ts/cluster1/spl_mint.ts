import { Keypair, PublicKey, Connection, Commitment } from "@solana/web3.js";
import { getOrCreateAssociatedTokenAccount, mintTo } from '@solana/spl-token';
import wallet from "../wba_wallet.json"

// Import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

//Create a Solana devnet connection
const commitment: Commitment = "confirmed";
const connection = new Connection("https://api.devnet.solana.com", commitment);

const token_decimals = 1_000_000n;

// Mint address
const mint = new PublicKey("BPTVwHoUrhTidfwTb8x8ScBe859uUhFtbRuLLEKsTtMq");

(async () => {
    try {
        // Start here
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection, keypair, mint, 
            keypair.publicKey
        );
    
        console.log("Token Account Created: ", tokenAccount.address.toBase58());
    
        const sig = await mintTo(connection, keypair, mint, tokenAccount.address, keypair, 10000000)
    
        console.log("Token Airdropped", sig);
    } catch(error) {
        console.log(`Oops, something went wrong: ${error}`)
    }
})()