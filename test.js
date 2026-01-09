const fetch = require('cross-fetch');

async function testConnection() {
    console.log("--- TESTING KONEKSI KE JUPITER ---");
    try {
        const res = await fetch('https://quote-api.jup.ag/v6/quote?inputMint=So11111111111111111111111111111111111111112&outputMint=EPjFW31Ac2ja3YEXn76up93RTfvcX87WH4y27QzmvCgl&amount=1000000');
        const text = await res.text();
        
        if (text.includes('<!DOCTYPE')) {
            console.log("❌ STATUS: TERBLOKIR (ISP mengirim halaman Internet Positif)");
        } else {
            console.log("✅ STATUS: TEMBUS! (Server Jupiter merespon dengan benar)");
        }
    } catch (e) {
        console.log("❌ STATUS: ERROR JARINGAN (" + e.message + ")");
    }
}
testConnection();
