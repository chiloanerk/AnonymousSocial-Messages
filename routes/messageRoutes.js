const express = require('express');
const router = express.Router();
const messageController = require('../src/controllers/messageController');

/* GET messages listing. */

router.get('/', messageController.fetchMessages);
router.post('/', messageController.sendMessage);

module.exports = router;
