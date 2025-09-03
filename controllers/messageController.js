const Message = require('../models/Message');


exports.sendMessage = async (req, res) => {
  try {
    const { senderEmail, receiverEmail, content } = req.body;

    const message = new Message({ senderEmail, receiverEmail, content });
    await message.save();

    res.status(201).json(message);
  } catch (err) {
    console.error('Send message error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


exports.getMessages = async (req, res) => {
  try {
    const { senderEmail, receiverEmail } = req.params;

    const messages = await Message.find({
      $or: [
        { senderEmail, receiverEmail },
        { senderEmail: receiverEmail, receiverEmail: senderEmail },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    console.error('Get messages error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getInbox = async (req, res) => {
  const { userEmail } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { senderEmail: userEmail },
        { receiverEmail: userEmail }
      ]
    }).sort({ createdAt: -1 });

    const conversationMap = new Map();

    messages.forEach(msg => {
      const contactEmail =
        msg.senderEmail === userEmail ? msg.receiverEmail : msg.senderEmail;

      if (!conversationMap.has(contactEmail)) {
        conversationMap.set(contactEmail, {
          email: contactEmail,
          lastMessage: msg.content,
          sentByUser: msg.senderEmail === userEmail,
          timestamp: msg.createdAt,
        });
      }
    });

    const inbox = Array.from(conversationMap.values());

    res.json(inbox);
  } catch (err) {
    console.error('Inbox fetch error:', err);
    res.status(500).json({ message: 'Failed to fetch inbox' });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (err) {
    console.error('Delete message error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all user conversations (participants only, no messages)
exports.getUserConversations = async (req, res) => {
  const { userEmail } = req.params;
  try {
    const messages = await Message.find({
      $or: [{ senderEmail: userEmail }, { receiverEmail: userEmail }]
    });

    const conversationSet = new Set();

    messages.forEach(msg => {
      const participants = [msg.senderEmail, msg.receiverEmail].sort();
      conversationSet.add(participants.join('-'));
    });

    const conversations = Array.from(conversationSet).map(pair => {
      const [a, b] = pair.split('-');
      return { participants: [a, b] };
    });

    res.json(conversations);
  } catch (err) {
    console.error('Get conversations error:', err);
    res.status(500).json({ message: 'Error fetching conversations' });
  }
};

// Delete a whole conversation between two users
exports.deleteConversation = async (req, res) => {
  const { userEmail, otherEmail } = req.params;
  try {
    await Message.deleteMany({
      $or: [
        { senderEmail: userEmail, receiverEmail: otherEmail },
        { senderEmail: otherEmail, receiverEmail: userEmail }
      ]
    });
    res.json({ message: 'Conversation deleted' });
  } catch (err) {
    console.error('Delete conversation error:', err);
    res.status(500).json({ message: 'Error deleting conversation' });
  }
};


