const User = require('../models/User');
const Book = require('../models/Book');
const Wishlist = require('../models/WishList'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    username,
    email,
    password: hashedPassword,
  });

  const token = generateToken(newUser._id);

  res.status(201).json({
    token,
    user: {
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
    },
  });
};


const loginUser = async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:', email);

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user._id);
  console.log(' Login successful for:', email);

  res.status(200).json({
    token,
    user: {
      _id: user._id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
  });
};


const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();

    const wishlistEntries = await Wishlist.find({ user: req.user._id })
      .populate('book')
      .lean();

    
    const wishlist = wishlistEntries
      .filter(entry => entry.book !== null)
      .map(entry => entry.book);

    const listings = await Book.find({ user: req.user._id });

    res.json({
      username: user.username,
      email: user.email,
      wishlist,
      listings,
    });
  } catch (error) {
    console.error(' Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
};


