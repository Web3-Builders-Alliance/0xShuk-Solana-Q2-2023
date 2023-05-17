import {IDL, WbaVault} from "../programs/wba_vault";
import { Connection, Keypair, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { Program, Wallet, AnchorProvider, Address, BN } from "@project-serum/anchor"
import { getOrCreateAssociatedTokenAccount, ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import wallet from "../wba_wallet.json"

// We're going to import our keypair from the wallet file
const keypair = Keypair.fromSecretKey(new Uint8Array(wallet));

// Create a devnet connection
const connection = new Connection("https://api.devnet.solana.com");

// Create our anchor provider
const provider = new AnchorProvider(connection, new Wallet(keypair), { commitment: "confirmed"});

const programId = new PublicKey("G7QyuwYPAcwrJ7p1S86gGbtVPt9A93vUyrMpc5xKEmoA");

// Create our program
const program = new Program<WbaVault>(IDL, programId, provider);

// const vaultState = Keypair.generate();
const vaultState = new PublicKey("BaWoD5gjekr522iV3Q4XjeTy7iV2vsKbVDvGf6uSc9da");

const vaultAuth = PublicKey.findProgramAddressSync([Buffer.from("auth"), vaultState.toBuffer()], programId)[0];
const vault = PublicKey.findProgramAddressSync([Buffer.from("vault"), vaultAuth.toBuffer()], programId)[0];

const mint = new PublicKey("BPTVwHoUrhTidfwTb8x8ScBe859uUhFtbRuLLEKsTtMq")

// async function Initialize() {
//     const tx = await program.methods.initialize()
//     .accounts({
//         owner: keypair.publicKey,
//         vault,
//         vaultAuth,
//         vaultState: vaultState.publicKey,
//         systemProgram: SystemProgram.programId
//     })
//     .signers([vaultState])
//     .rpc()

//     console.log("Vault is initialized", tx);
// }

async function Deposit() {
    const tx = await program.methods.deposit(new BN( 0.1 * LAMPORTS_PER_SOL))
    .accounts({
        owner: keypair.publicKey,
        vault,
        vaultAuth,
        vaultState,
        systemProgram: SystemProgram.programId
    })
    .rpc();

    console.log("SOL deposited", tx);
}

async function Withdraw() {
    const tx = await program.methods.withdraw(new BN( 0.1 * LAMPORTS_PER_SOL))
    .accounts({
        owner: keypair.publicKey,
        vault,
        vaultAuth,
        vaultState,
        systemProgram: SystemProgram.programId
    })
    .rpc();

    console.log("SOL withdrawn", tx);
}

async function DepositSpl() {
    const ownerAta = await getOrCreateAssociatedTokenAccount(
        connection, keypair, mint, keypair.publicKey
    );

    const vaultAta = await getOrCreateAssociatedTokenAccount(
        connection, keypair, mint, vaultAuth, true
    );

    const tx = await program.methods.depositSpl(new BN( 50000))
    .accounts({
        owner: keypair.publicKey,
        ownerAta: ownerAta.address,
        vaultAta : vaultAta.address,
        vaultAuth,
        vaultState,
        systemProgram: SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenMint: mint
    })
    .rpc();

    console.log("SPL token deposited", tx);
}

async function WithdrawSpl() {
    const ownerAta = await getOrCreateAssociatedTokenAccount(
        connection, keypair, mint, keypair.publicKey
    );

    const vaultAta = await getOrCreateAssociatedTokenAccount(
        connection, keypair, mint, vaultAuth, true
    );

    const tx = await program.methods.withdrawSpl(new BN( 50000))
    .accounts({
        owner: keypair.publicKey,
        ownerAta: ownerAta.address,
        vaultAta : vaultAta.address,
        vaultAuth,
        vaultState,
        systemProgram: SystemProgram.programId,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        tokenMint: mint
    })
    .rpc();

    console.log("SPL token withdrawn", tx);
}

(async ()=> {
    // await Initialize()
    // await Deposit()
    // await Withdraw()
    // await DepositSpl()
    await WithdrawSpl()
})();