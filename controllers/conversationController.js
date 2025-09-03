
import Conversation from '../models/Conversation.js';

export const createConversation = async (req, res) => {
  const { senderEmail, receiverEmail } = req.body;

  try {
    const existing = await Conversation.findOne({
      participants: { $all: [senderEmail, receiverEmail] },
    });

    if (existing) return res.status(200).json(existing);

    const newConversation = new Conversation({
      participants: [senderEmail, receiverEmail],
    });

    await newConversation.save();
    res.status(201).json(newConversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserConversations = async (req, res) => {
  const userEmail = req.params.email;

  try {
    const conversations = await Conversation.find({
      participants: userEmail,
    });
    res.status(200).json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

