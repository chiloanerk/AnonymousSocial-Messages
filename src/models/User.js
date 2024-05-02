const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const { generateKeyPair, encrypt } = require('../functions/cryptoUtils');

const userSchema = new mongoose.Schema({
    username: String,
    uniqueLink: String,
    publicKey: String,
}, { timestamps: true });


userSchema.statics.signup = async function (username) {
    if (!username) {
        throw Error('Username is required');
    }

    const uniqueLink = crypto.randomBytes(6).toString('hex');
    const { publicKey, privateKey } = generateKeyPair();
    const encryptedPrivateKey = encrypt(privateKey);
    const user = await this.create({ username, uniqueLink, publicKey });

    const token = jwt.sign({ _id: user._id, encryptedPrivateKey }, process.env.JWT_SECRET, { expiresIn: '10m' });

    return { user, uniqueLink, token, publicKey };
}

module.exports = mongoose.model('User', userSchema);