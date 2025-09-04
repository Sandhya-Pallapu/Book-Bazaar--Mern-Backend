const express = require('express');
const router = express.Router();
const Message = require('../models/Message'); // <-- Import Message model
const messageController = require('../controllers/messageController');

// Send a message
router.post('/', messageController.sendMessage);

// Get inbox for a user
router.get('/inbox/:userEmail', messageController.getInbox);

// Get messages between two users
router.get('/:senderEmail/:receiverEmail', messageController.getMessages);

// Get all conversations for a user
router.get('/conversations/:userEmail', messageController.getUserConversations);

// Delete a conversation between two users
router.delete('/conversation/:userEmail/:otherEmail', async (req, res) => {
  try {
    const { userEmail, otherEmail } = req.params;

    const result = await Message.deleteMany({
      $or: [
        { senderEmail: userEmail, receiverEmail: otherEmail },
        { senderEmail: otherEmail, receiverEmail: userEmail },
      ],
    });

    res.json({ 
      message: 'Conversation deleted successfully', 
      deletedCount: result.deletedCount 
    });
  } catch (err) {
    console.error('Delete conversation error:', err);
    res.status(500).json({ error: err.message || 'Failed to delete conversation' });
  }
});

// Delete a single message by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ error: 'Message not found' });
    }

    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error('Delete message error:', err);
    res.status(500).json({ error: err.message || 'Failed to delete message' });
  }
});

module.exports = router;


