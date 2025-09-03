// routes/wishlistRoutes.js
const express = require('express');
const router = express.Router();
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require('../controllers/wishlistController');

const {protect} = require('../middleware/authMiddleware');

router.get('/', protect, getWishlist);
router.post('/add', protect, addToWishlist);
router.delete('/remove/:bookId', protect, removeFromWishlist);

module.exports = router;


