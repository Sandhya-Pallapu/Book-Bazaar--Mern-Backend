
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createBook,getAllBooks } = require('../controllers/bookController');

router.post('/create', protect, createBook); // ✅ Authenticated route
// routes/bookRoutes.js
router.get('/', getAllBooks); // this matches GET /api/books

module.exports = router;
