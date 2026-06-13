import Message from "../models/Message.js";
import User from "../models/User.js";

// Send a message
export const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    if (!receiverId || !content) {
      return res.status(400).json({ success: false, message: "Receiver and content are required" });
    }

    const message = new Message({
      sender: req.user.id,
      receiver: receiverId,
      schoolId: req.user.schoolId,
      content
    });
    await message.save();

    res.status(201).json({ success: true, message: "Message sent", data: message });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to send message", error: err.message });
  }
};

// Get conversation list (unique users the current user has messaged with)
export const getConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: -1 });

    // Extract unique conversation partners
    const partnerIds = new Set();
    messages.forEach(msg => {
      const partnerId = msg.sender.toString() === userId.toString()
        ? msg.receiver.toString()
        : msg.sender.toString();
      partnerIds.add(partnerId);
    });

    // Get user details for each partner
    const partners = await User.find({ _id: { $in: Array.from(partnerIds) } })
      .select("name email role classNumber");

    // Add last message and unread count for each partner
    const conversations = partners.map(partner => {
      const partnerMsgs = messages.filter(
        msg => msg.sender.toString() === partner._id.toString() ||
               msg.receiver.toString() === partner._id.toString()
      );
      const lastMessage = partnerMsgs[0];
      const unreadCount = partnerMsgs.filter(
        msg => msg.receiver.toString() === userId.toString() && !msg.read
      ).length;

      return {
        partner: { _id: partner._id, name: partner.name, email: partner.email, role: partner.role, classNumber: partner.classNumber },
        lastMessage: lastMessage ? { content: lastMessage.content, createdAt: lastMessage.createdAt } : null,
        unreadCount
      };
    });

    // Sort by last message time
    conversations.sort((a, b) => {
      if (!a.lastMessage) return 1;
      if (!b.lastMessage) return -1;
      return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
    });

    res.json({ success: true, data: conversations });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch conversations", error: err.message });
  }
};

// Get messages between current user and another user
export const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user.id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    }).sort({ createdAt: 1 });

    // Mark received messages as read
    await Message.updateMany(
      { sender: userId, receiver: currentUserId, read: false },
      { read: true }
    );

    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch messages", error: err.message });
  }
};

// Get contacts in the same school (teachers see students, students see teachers)
export const getContacts = async (req, res) => {
  try {
    const targetRole = req.user.role === "teacher" ? "student" : "teacher";
    const contacts = await User.find({
      schoolId: req.user.schoolId,
      role: targetRole
    }).select("name email role classNumber subjects standards");

    res.json({ success: true, data: contacts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch contacts", error: err.message });
  }
};
