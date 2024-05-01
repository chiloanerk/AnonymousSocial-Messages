const express = require('express');
const router = express.Router();
const userController = require("../src/controllers/userController");

/* GET users listing. */
router.post('/signup', userController.createUser);
router.get('/list', userController.getUsers);
router.get('/:uniqueLink', userController.sendMessageToUser);

module.exports = router;
