const User = require('../models/User');
const Message = require('../models/Message');
const { decryptPrivateKey, decryptMessage } = require('../functions/cryptoUtils');

const getUsers = async (req, res) => {
    try {
        const list = await User.find().sort('-createdAt');
        res.status(200).json(list);
    } catch (error) {
        res.status(404).json({error: error});
    }
}

const createUser = async (req, res) => {
    const { username } = req.body;
    try {
        const existingUser = await User.findOne(username);
        if (existingUser) {
            return res.json({message: "Username already exists"})
        }
        const user = await User.signup( username );
        res.status(201).json({ username, uniqueLink: user.uniqueLink, token: user.token, encryptedPrivateKey: user.encryptedPrivateKey })
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

const sendMessageToUser = async (req, res) => {
    const { uniqueLink } = req.params;
    try {
        const user = await User.findOne({ uniqueLink });
        if (!user) {
            return res.status(404).json({error: 'User not found'});
        }

        res.status(200).json({message: `Send a message to user: ${user.username}`});
    } catch (error) {
        res.status(500).json({ error: 'Failed to find user' });
    }
}

const getInbox = async (req, res) => {
    try {
        const {_id, encryptedPrivateKey} = req.user;
        const privateKey = decryptPrivateKey(encryptedPrivateKey);
        const userData = await User.findById(_id, { username: 1 }, null);
        console.log(userData);
        const messages = await Message.find({ recipient: _id }).sort('-createdAt');

        if (messages.length === 0) {
            res.status(200).json({message: `No messages found ${userData.username}`});
            return;
        }

        const decryptedMessages = messages.map(message => ({
            ...message.toObject(),
            message: decryptMessage(message.message, privateKey)
        }));

        console.log('Decrypted Messages:', decryptedMessages);
        res.status(200).json(decryptedMessages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
}


module.exports = {
    createUser, getInbox, getUsers, sendMessageToUser
}