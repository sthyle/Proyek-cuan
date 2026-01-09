const fetch = require('node-fetch');

async function getPrice() {
    console.log("--- Menghubungkan ke API Global ---");
    
    // Kita coba Birdeye & Binance sekaligus sebagai backup
    const sources = [
        "https://public-api.birdeye.so/public/price?address=So11111111111111111111111111111111111111112",
        "https://api.binance.com/api/v3/ticker/price?symbol=SOLUSDC"
    ];

    for (let url of sources) {
        try {
            const response = await fetch(url, { timeout: 5000 });
            const data = await response.json();
            
            let price = data.data ? data.data.value : data.price;
            
            if (price) {
                console.log(`\n✅ BERHASIL DARI: ${new URL(url).hostname}`);
                console.log(`Harga 1 SOL = $${parseFloat(price).toFixed(2)} USDC`);
                return; // Berhenti jika salah satu berhasil
            }
        } catch (e) {
            console.log(`⚠️ Jalur ${new URL(url).hostname} Gagal...`);
        }
    }
    console.log("\n❌ Semua jalur diblokir ISP Anda.");
}

getPrice();
