const express = require('express');
const router = express.Router();
const userController = require('../src/controllers/userController');
const authMiddleware = require('../src/middlewares/auth');

router.get('/', authMiddleware, userController.getInbox);

module.exports = router;