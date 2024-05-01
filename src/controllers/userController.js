const User = require('../models/User');
const Message = require('../models/Message');
const jwt = require('jsonwebtoken');

const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '10m' })
}

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
        const token = createToken(user._id);
        res.status(201).json({ username, uniqueLink: user.uniqueLink, token })
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
    const user = req.user;
    try {
        // Find messages sent to the user
        const messages = await Message.find({ recipient: user._id }).sort('-createdAt');
        if (messages.length === 0) {
            return res.status(404).json({ message: 'No messages found in your inbox' });
        }
        res.status(200).json({
            Info: `Welcome to your inbox ${user.username}`,
            messages: messages
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
}


module.exports = {
    createUser, getInbox, getUsers, sendMessageToUser
}