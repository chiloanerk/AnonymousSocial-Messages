const crypto = require('crypto');

// Generate a key pair
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048, // Length of the key in bits
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    }
});

// Sender encrypts the message using the recipient's public key
const message = 'Hello, world!';
const encryptedMessage = crypto.publicEncrypt(publicKey, Buffer.from(message));

// Recipient decrypts the message using their private key
const decryptedMessage = crypto.privateDecrypt(privateKey, encryptedMessage);

console.log('Encrypted Message:', encryptedMessage.toString('base64'));
console.log('Decrypted Message:', decryptedMessage.toString());
