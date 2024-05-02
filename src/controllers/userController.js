const User = require('../models/User');
const Message = require('../models/Message');
const { decrypt, decryptMessage } = require('../functions/cryptoUtils');

const getUsers = async (req, res) => {
    try {
        const list = await User.find();
        res.status(200).json(list);
    } catch (error) {
        res.status(404).json({error: error});
    }
}

const createUser = async (req, res) => {
    const { username } = req.body;
    try {
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
        const user = req.user;
        const encryptedPrivateKey = user.encryptedPrivateKey;
        const privateKey = decrypt(encryptedPrivateKey);

        const messages = await Message.find({ recipient: user._id }).sort('-createdAt');

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