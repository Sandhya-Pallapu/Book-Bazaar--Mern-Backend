const express = require('express');
const router = express.Router();

const {
  getAllBooks,
  addBook,
  updateBook,
  deleteBook,
  getUserCount,
  getAllUsers,         
  deleteUserById       
} = require('../controllers/adminController');

const { protect, adminOnly } = require('../middleware/authMiddleware');


router.get('/books', protect, adminOnly, getAllBooks);



router.put('/books/:id', protect, adminOnly, updateBook);

router.delete('/books/:id', protect, adminOnly, deleteBook);

router.get('/users/count', protect, adminOnly, getUserCount);


router.get('/users', protect, adminOnly, getAllUsers);


router.delete('/users/:id', protect, adminOnly, deleteUserById);

module.exports = router;


