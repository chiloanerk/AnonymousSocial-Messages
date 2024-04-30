const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: String,
    uniqueLink: String,
}, { timestamps: true });

userSchema.statics.signup = async function (username) {
    if (!username) {
        throw Error('Username is required');
    }

    return await this.create({ username });
}

module.exports = mongoose.model('User', userSchema);