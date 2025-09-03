const express = require('express');
const router = express.Router();
const { registerUser, loginuser } = require('../controllers/userController');

router.post('/register', registerUser);

router.post('/login', loginuser);

module.exports = router;
