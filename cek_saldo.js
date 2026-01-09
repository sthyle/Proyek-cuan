require('dotenv').config();
const { Connection, Keypair } = require('@solana/web3.js');
const bs58 = require('bs58').default; // Tambahkan .default di sini

async function main() {
    // Jalur Helius yang sudah terbukti tembus di HP Anda
    const rpcUrl = "https://api.mainnet-beta.solana.com";
    const connection = new Connection(rpcUrl);

    try {
        const secretKeyString = process.env.PRIVATE_KEY;
        
        // Memastikan private key terbaca dan didekode dengan benar
        const secretKey = bs58.decode(secretKeyString);
        const wallet = Keypair.fromSecretKey(secretKey);
        
        console.log("--- Memeriksa Dompet ---");
        console.log("Alamat Dompet:", wallet.publicKey.toBase58());

        const balance = await connection.getBalance(wallet.publicKey);
        console.log("Saldo Anda:", balance / 1000000000, "SOL");
        console.log("\n✅ STATUS: Siap untuk Jual/Beli!");
    } catch (error) {
        console.log("❌ ERROR: Periksa kembali file .env Anda.");
        console.log("Detail Error:", error.message);
    }
}

main();
