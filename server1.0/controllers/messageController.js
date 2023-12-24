// controllers/messageController.js

const router = require('express').Router();
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const messageService = require('../services/messageService');

// Define your User model
const User = sequelize.define('User', {
  // Example:
  // username: {
  //   type: DataTypes.STRING,
  //   allowNull: false,
  // },
});

// Define your ChatRoom model
const ChatRoom = sequelize.define('ChatRoom', {
  // Example:
  // buyerId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  // },
  // sellerId: {
  //   type: DataTypes.INTEGER,
  //   allowNull: false,
  // },
});

router.post('/createChatRoom', async (req, res) => {
  const { message, receiver } = req.body;
  try {
    const chatRoom = await messageService.createChatRoom(req.user.id, receiver);

    // Assuming you have buyerId and sellerId in your ChatRoom model
    await ChatRoom.update({ message }, { where: { id: chatRoom.id } });

    res.status(200).json({ messageId: chatRoom.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/getUserConversations', async (req, res) => {
  try {
    const allChats = await ChatRoom.findAll({
      include: [
        { model: User, as: 'buyer' },
        { model: User, as: 'seller' },
      ],
    });

    const userChats = allChats.filter(
      (x) => x.buyer.id === req.user.id || x.seller.id === req.user.id
    );

    const checkedChats = userChats.map((x) => ({
      chats: x,
      isBuyer: x.buyer.id === req.user.id,
      myId: req.user.id,
    }));

    res.status(200).json(checkedChats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/sendMessage', async (req, res) => {
  const { chatId, message } = req.body;
  try {
    const chat = await ChatRoom.update(
      { conversation: { senderId: req.user.id, message } },
      { where: { id: chatId } }
    );

    console.log(chat);
    res.status(200).json({ sender: req.user.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
