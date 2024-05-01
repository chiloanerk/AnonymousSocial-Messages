const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    username: String,
    uniqueLink: String,
}, { timestamps: true });

userSchema.statics.signup = async function (username) {
    if (!username) {
        throw Error('Username is required');
    }

    const uniqueLink = crypto.randomBytes(6).toString('hex');

    return await this.create({ username, uniqueLink });
}

module.exports = mongoose.model('User', userSchema);