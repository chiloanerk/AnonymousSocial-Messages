const express = require('express');
const router = express.Router();
const adminController = require("../src/controllers/adminController");

/* GET users listing. */
router.post('/signup', adminController.createAdmin);
router.post('/login', adminController.loginAdmin)
router.get('/', adminController.fetchList)

module.exports = router;
