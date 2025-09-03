const Book = require('../models/Book');
const createBook = async (req, res) => {
  const { title, author, genre, condition, price, image, sellerName, sellerEmail } = req.body;

  if (!title || !author || !price || !condition) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }

  try {
    const book = new Book({
      title,
      author,
      genre,
      condition,
      price,
      image,
      sellerName,
      sellerEmail,
      user: req.user._id, // track the owner user
    });

    const saved = await book.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error in createBook:', error);
    res.status(500).json({ message: 'Failed to create book' });
  }
};

const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({})
      .populate('user', '_id name email'); // optionally populate full user info

    res.status(200).json(books);
  } catch (error) {
    console.error('Error in getAllBooks:', error);
    res.status(500).json({ message: 'Failed to fetch books' });
  }
};

module.exports = {
  createBook,
  getAllBooks,
};
