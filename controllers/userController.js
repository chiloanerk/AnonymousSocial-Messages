const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '10m' })
}

const createUser = async (req, res) => {
    const { username } = req.body;
    try {
        const user = await User.signup( username );
        const token = createToken(user._id);
        res.status(201).json({ username, token })
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

module.exports = {
    createUser
}