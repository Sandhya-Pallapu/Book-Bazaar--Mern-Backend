const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');

// POST - Send message
router.post('/', messageController.sendMessage);

// ✅ GET - Inbox contacts (must come before two-email route)
router.get('/inbox/:userEmail', messageController.getInbox);

// GET - Conversation between two users
router.get('/:senderEmail/:receiverEmail', messageController.getMessages);
// routes/messageRoutes.js
router.get('/conversations/:userEmail', messageController.getUserConversations);
router.delete('/conversation/:userEmail/:otherEmail', messageController.deleteConversation);

// DELETE - Delete a message by ID
// DELETE /api/messages/conversation/:userEmail/:otherEmail
router.delete("/conversation/:userEmail/:otherEmail", async (req, res) => {
  try {
    const { userEmail, otherEmail } = req.params;

    await Message.deleteMany({
      $or: [
        { senderEmail: userEmail, receiverEmail: otherEmail },
        { senderEmail: otherEmail, receiverEmail: userEmail },
      ],
    });

    res.json({ message: "Conversation deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete conversation" });
  }
});
// DELETE a single message by its ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.json({ message: 'Message deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete message' });
  }
});


module.exports = router;
