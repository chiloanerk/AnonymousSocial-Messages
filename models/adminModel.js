const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const adminSchema = new mongoose.Schema({
    password: String,
    email: String,
}, { timestamps: true });

adminSchema.statics.signup = async function (email, password) {
    if (!email || !password) {
        throw Error('All fields are required');
    }
    const emailExists = await this.findOne({ email });
    if (emailExists) {
        throw Error('Email already exists');
    }
    if (!validator.isEmail(email)) {
        throw Error('Email format wrong');
    }
    if (!validator.isStrongPassword(password, { minLength: 6, minUppercase: false, minSymbols: false })) {
        throw Error('Password must be at least 6 characters');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return await this.create({ email, password: hashedPassword });
}

adminSchema.statics.login = async function (email, password) {
    if (!email || !password) {
        throw Error('All fields are required');
    }
    const admin = await this.findOne({ email });
    if (!admin) {
        throw Error('Incorrect email');
    }
    const compare = await bcrypt.compare(password, admin.password);
    if (!compare) {
        throw Error('Incorrect password');
    }
    return admin;
}

module.exports = mongoose.model('Admin', adminSchema);
