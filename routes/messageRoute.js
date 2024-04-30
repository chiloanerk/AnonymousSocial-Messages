const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

/* GET messages listing. */

router.get('/', messageController.fetchMessage);
router.post('/', messageController.createMessage);

module.exports = router;
