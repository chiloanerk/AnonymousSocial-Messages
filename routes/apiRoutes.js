const express = require('express');
const router  = express.Router();

const usersRoute = require('./userRoutes');
const adminRoute = require('./adminRoutes');
const messageRoute = require('./messageRoutes');
const inboxRoute = require('./inboxRoutes');


router.use('/users', usersRoute);
router.use('/admin', adminRoute);
router.use('/messages', messageRoute);
router.use('/inbox', inboxRoute);
router.use('/send', usersRoute);

module.exports = router;