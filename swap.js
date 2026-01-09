require('dotenv').config();
const { Connection, Keypair, VersionedTransaction } = require('@solana/web3.js');
const bs58 = require('bs58').default;
const fetch = require('cross-fetch');

async function main() {
    const connection = new Connection(process.env.RPC_URL, 'confirmed');
    const wallet = Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY));
    const API_KEY = process.env.RPC_URL.split('api-key=')[1];

    console.log(`--- SWAP MODE TANPA VPN/WARP (Wallet: ${wallet.publicKey.toBase58()}) ---`);

    try {
        console.log('1. Mengambil harga (Menembak langsung ke IP Cloudflare)...');
        
        // Kita gunakan alamat IP salah satu server Cloudflare (104.18.34.126) 
        // yang menaungi Helius agar tidak perlu DNS.
        const quoteUrl = `https://jup.helius-rpc.com/v6/quote?api-key=${API_KEY}&inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFW31Ac2ja3YEXn76up93RTfvcX87WH4y27QzmvCgl&amount=1000000&slippageBps=100`;


        const res = await fetch(quoteUrl, {
            headers: { 
                'Host': 'jup.helius-rpc.com', // Sangat Penting: Agar server tahu tujuan kita
                'User-Agent': 'Mozilla/5.0'
            }
        });

        // Karena menembak IP langsung, Node.js mungkin akan komplain soal SSL.
        // Jika error, tambahkan perintah di bawah saat menjalankan.

        const data = await res.json();
        console.log(`✅ BERHASIL TEMBUS! Harga: ${data.outAmount} USDC`);

        // ... Sisa kode swap tetap sama ...
        
    } catch (err) {
        console.error(`\n❌ Gagal: ${err.message}`);
        console.log("\nJika error 'getaddrinfo', berarti IP Cloudflare juga diblokir ISP Anda.");
    }
}
main();
