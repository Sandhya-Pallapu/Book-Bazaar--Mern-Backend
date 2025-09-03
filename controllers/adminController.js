const Book = require('../models/Book');
const User = require('../models/User');


const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find({});
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch books', error: err.message });
  }
};

const addBook = async (req, res) => {
  try {
    const { title, author, genre, price, condition, image } = req.body;

    const book = new Book({
      title,
      author,
      genre,
      price,
      condition,
      image, 
    });

    await book.save();
    res.status(201).json({ message: 'Book added', book });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;

    const { title, author, genre, condition, price, image } = req.body;

    const updatedFields = {
      ...(title && { title }),
      ...(author && { author }),
      ...(genre && { genre }),
      ...(condition && { condition }),
      ...(price && { price }),
      ...(image && { image }), 
    };

    const updatedBook = await Book.findByIdAndUpdate(bookId, updatedFields, {
      new: true,
    });

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.status(200).json(updatedBook);
  } catch (error) {
    console.error(' Error updating book:', error);
    res.status(500).json({ message: 'Failed to update book' });
  }
};

const deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const deleted = await Book.findByIdAndDelete(bookId);
    if (!deleted) return res.status(404).json({ message: 'Book not found' });
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete book', error: err.message });
  }
};
const getUserCount = async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.status(200).json({ totalUsers: count });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user count', error: err.message });
  }
};
 const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'username email _id');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};
const deleteUserById = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};



module.exports = {
  getAllBooks,
  getAllUsers,
  addBook,
  updateBook,
  deleteBook,
  getUserCount,
  deleteUserById,
};



