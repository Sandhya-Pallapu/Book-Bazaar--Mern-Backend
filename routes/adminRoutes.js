const express = require('express');
const router = express.Router();

const {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
  getUserCount,
  getAllUsers,         // ✅ Add this in your controller
  deleteUserById       // ✅ Add this in your controller
} = require('../controllers/adminController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

// Book Routes
router.get('/books', protect, adminOnly, getAllBooks);


// ✅ Remove upload.single('image') if previously added here
router.put('/books/:id', protect, adminOnly, updateBook);

router.delete('/books/:id', protect, adminOnly, deleteBook);

// User Stats
router.get('/users/count', protect, adminOnly, getUserCount);

// ✅ Admin can see all users
router.get('/users', protect, adminOnly, getAllUsers);

// ✅ Admin can delete any user
router.delete('/users/:id', protect, adminOnly, deleteUserById);

module.exports = router;


