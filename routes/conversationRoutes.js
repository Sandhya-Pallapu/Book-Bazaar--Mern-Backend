const express = require('express');
const router = express.Router();
const Conversation = require('../models/Conversation');
const { protect } = require('../middleware/authMiddleware');

// Get all conversations for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id,
    }).populate('participants', 'name email');
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create or get existing conversation
router.post('/', protect, async (req, res) => {
  const { otherUserId } = req.body;
  try {
    let convo = await Conversation.findOne({
      participants: { $all: [req.user._id, otherUserId] }
    });

    if (!convo) {
      convo = new Conversation({
        participants: [req.user._id, otherUserId],
      });
      await convo.save();
    }

    res.json(convo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
