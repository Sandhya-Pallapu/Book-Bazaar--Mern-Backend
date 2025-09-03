
const Wishlist = require('../models/WishList');
const Book = require('../models/Book');
const User = require('../models/User'); 

const addToWishlist = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admins cannot use wishlist' });
    }

    const userId = req.user._id;
    const { bookId } = req.body;

    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required' });
    }

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const existing = await Wishlist.findOne({ user: userId, book: bookId });
    if (existing) {
      return res.status(409).json({ message: 'Already in wishlist' });
    }

    const newItem = await Wishlist.create({ user: userId, book: bookId });
    res.status(201).json(newItem);
  } catch (error) {
    console.error('Wishlist Add Error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};


const getWishlist = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admins cannot use wishlist' });
    }

    const wishlist = await Wishlist.find({ user: req.user._id }).populate('book');
    res.json(wishlist.map((item) => item.book));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching wishlist' });
  }
};


const removeFromWishlist = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      return res.status(403).json({ message: 'Admins cannot use wishlist' });
    }

    const { bookId } = req.params;

    const removed = await Wishlist.findOneAndDelete({
      user: req.user._id,
      book: bookId,
    });

    if (!removed) {
      return res.status(404).json({ message: 'Book not found in wishlist' });
    }

    res.json({ message: 'Removed from wishlist' });
  } catch (error) {
    res.status(500).json({ message: 'Server error removing from wishlist' });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
};

