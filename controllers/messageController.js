const Message = require('../models/messageModel');
const error = require("jsonwebtoken/lib/JsonWebTokenError");

const fetchMessage = async (req, res) => {
    try {
        const message = await Message.find().sort('-createdAt');
        if (message < 1) {
            return res.status(404).json({ error: error.message });
        }
        res.status(200).json(message)
    } catch (error) {
        console.error(error);
    }
}

const createMessage = async (req, res) => {
    const { message } = req.body;
    try {
        const createdMessage = await Message.create({message});
        res.status(201).json(createdMessage);
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    fetchMessage, createMessage
}