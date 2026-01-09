const axios = require('axios');

async function checkConnection() {
    try {
        console.log('Mencoba terhubung ke Google...');
        const response = await axios.get('https://www.google.com');
        if (response.status === 200) {
            console.log('Koneksi berhasil! Status:', response.status);
        }
    } catch (error) {
        console.error('Koneksi gagal:', error.message);
        console.error('Cek koneksi internet di HP Anda.');
    }
}

checkConnection();
