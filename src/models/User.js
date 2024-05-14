const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
const { generateKeyPair, encryptPrivateKey } = require('../functions/cryptoUtils');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30,
        trim: true
    },
    uniqueLink: {
        type: String,
        unique: true
    },
    publicKey: String,
    refreshToken: [String]
}, { timestamps: true });


userSchema.statics.signup = async function (username) {
    if (!username) {
        throw Error('Username is required');
    }

    try {
        const uniqueLink = crypto.randomBytes(6).toString('hex');
        const { publicKey, privateKey } = generateKeyPair();
        const encryptedPrivateKey = encryptPrivateKey(privateKey);
        const user = await this.create({ username, uniqueLink, publicKey });
        const token = jwt.sign({ _id: user._id, encryptedPrivateKey }, process.env.JWT_SECRET, { expiresIn: '30d' });

        return { user, uniqueLink, token, publicKey };
    } catch (error) {
        throw error;
    }
}

module.exports = mongoose.model('User', userSchema);