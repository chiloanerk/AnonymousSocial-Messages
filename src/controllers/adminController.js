const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '10m' })
}

const fetchList = async (req, res) => {
    try {
        const list = await Admin.find();
        res.status(200).json(list);
    } catch (error) {
        res.status(404).json({error: error});
    }
}

const createAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.signup( email, password );
        const token = createToken(admin._id);
        res.status(201).json({ email, password, token })
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const admin = await Admin.login(email, password);
        const token = createToken(admin._id);

        res.status(200).json({ email, token })
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}

module.exports = {
    createAdmin, loginAdmin, fetchList
}