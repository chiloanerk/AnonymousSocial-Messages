const mongoose = require('mongoose');
const crypto = require('crypto');
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    username: String,
    uniqueLink: String,
    publicKey: String,
}, { timestamps: true });

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

userSchema.statics.signup = async function (username) {
    if (!username) {
        throw Error('Username is required');
    }

    const uniqueLink = crypto.randomBytes(6).toString('hex');
    const { publicKey, privateKey } = generateKeyPair();

    const user = await this.create({ username, uniqueLink, publicKey });

    const token = jwt.sign({ _id: user._id, privateKey }, process.env.JWT_SECRET, { expiresIn: '10m' });

    return { user, uniqueLink, token, publicKey };
}

module.exports = mongoose.model('User', userSchema);