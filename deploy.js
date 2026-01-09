require('dotenv').config();
const { Connection, Keypair, VersionedTransaction } = require('@solana/web3.js');
const bs58 = require('bs58').default;
const fetch = require('cross-fetch');
const { SocksProxyAgent } = require('socks-proxy-agent');

async function main() {
    const connection = new Connection(process.env.RPC_URL, 'confirmed');
    const wallet = Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY));
    
    // Ini adalah 'jembatan' ke Tor yang kamu jalankan di Session 3
    const agent = new SocksProxyAgent('socks5h://127.0.0.1:9050');

    console.log(`--- EXECUTE SWAP VIA TOR (Wallet: ${wallet.publicKey.toBase58()}) ---`);

    try {
        console.log('1. Mengambil harga via Tor Tunnel...');
        const quoteUrl = 'https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFW31Ac2ja3YEXn76up93RTfvcX87WH4y27QzmvCgl&amount=1000000&slippageBps=100';
        
        const res = await fetch(quoteUrl, { agent });
        const quoteResponse = await res.json();

        if (!quoteResponse.outAmount) {
            console.log('Isi respon:', quoteResponse);
            throw new Error("Gagal mendapatkan harga.");
        }
        console.log(`✅ Harga didapat: ${quoteResponse.outAmount} USDC`);

        console.log('2. Membuat transaksi...');
        const swapRes = await fetch('https://quote-api.jup.ag/v6/swap', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                quoteResponse,
                userPublicKey: wallet.publicKey.toString(),
                wrapAndUnwrapSol: true
            }),
            agent
        });

        const { swapTransaction } = await swapRes.json();
        const transaction = VersionedTransaction.deserialize(Buffer.from(swapTransaction, 'base64'));
        transaction.sign([wallet]);

        console.log('3. Mengirim transaksi (Final Step)...');
        const txid = await connection.sendRawTransaction(transaction.serialize(), {
            skipPreflight: true,
            maxRetries: 2
        });

        console.log(`\n🚀 BERHASIL! \nCek di: https://solscan.io/tx/${txid}`);

    } catch (err) {
        console.error(`\n❌ Gagal: ${err.message}`);
        console.log("Saran: Pastikan Session [3] masih menampilkan 'Bootstrapped 100% (done)'");
    }
}
main();
