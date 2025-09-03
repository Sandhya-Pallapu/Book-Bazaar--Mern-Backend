const express = require('express');
const {
  registerUser,
  loginUser,
  getUserProfile
} = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Register & Login
router.post('/register', registerUser);
router.post('/login', loginUser);

// Get Profile (Listings + Wishlist)
router.get('/profile', protect, getUserProfile);

module.exports = router;

