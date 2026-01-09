const solanaWeb3 = require('@solana/web3.js');
const bs58 = require('bs58').default; // Perbaikan di sini

// Generate keypair (public key dan private key) baru secara acak
const keypair = solanaWeb3.Keypair.generate();

console.log('Alamat Wallet (Public Address):', keypair.publicKey.toBase58());
// Gunakan bs58.encode untuk mengubah array angka menjadi teks Base58
console.log('Private Key (Base58 - JANGAN BAGIKAN!):', bs58.encode(keypair.secretKey));
