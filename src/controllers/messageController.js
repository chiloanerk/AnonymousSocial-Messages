const Message = require('../models/Message');
const User = require('../models/User');
const {encryptMessage} = require("../functions/cryptoUtils");

const fetchMessages = async (req, res) => {
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

const sendMessage = async (req, res) => {
    const { message, uniqueLink } = req.body;
    try {
        // Find recipient via unique link
        const recipient = await User.findOne({ uniqueLink: uniqueLink });
        if (!recipient) {
            res.status(404).json({ error: 'Recipient not found' });
        }
        const encryptedMessage = encryptMessage(message, recipient.publicKey);

        const newMessage = new Message({
            recipient: recipient._id,
            message: encryptedMessage
        });
        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully '});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    fetchMessages, sendMessage
}