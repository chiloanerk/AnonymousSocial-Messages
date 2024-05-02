const crypto =  require("crypto");
const dotenv = require("dotenv");
dotenv.config();

const hexToBuffer = (hexString) => {
    return Buffer.from(hexString, 'hex');
}

const generateKeyPair = () => {
    return crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });
};

const key = process.env.ENCRYPT_KEY;
const keyBuffer = hexToBuffer(key);

const iv = crypto.randomBytes(16);
const algorithm = 'aes-256-cbc';

const encryptPrivateKey = (text) => {
    let cipher = crypto.createCipheriv( algorithm, keyBuffer, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

const decryptPrivateKey = (text) => {
    let iv = Buffer.from(text.iv, 'hex');
    let encryptedText = Buffer.from(text.encryptedData, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, keyBuffer, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted,decipher.final()]);
    return decrypted.toString();
}

const encryptMessage = (text, publicKey) => {
    try {
        const encryptedMessage = crypto.publicEncrypt({
            key: publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        }, Buffer.from(text));

        return encryptedMessage.toString('hex');
    } catch (error) {
        console.log('Encryption error:', error);
        throw Error(error);
    }
}

const decryptMessage = (encryptedMessage, privateKey) => {
    try {
        const encryptedMessageBuffer = Buffer.from(encryptedMessage, 'hex');
        const decryptedMessage = crypto.privateDecrypt({
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING
        }, encryptedMessageBuffer);
        return decryptedMessage.toString();
    } catch (error) {
        console.log('Decryption error:', error);
        throw Error(error);
    }
}

module.exports = {
    generateKeyPair, encryptPrivateKey, decryptPrivateKey, encryptMessage, decryptMessage,
}