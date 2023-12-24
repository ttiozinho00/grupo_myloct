// services/messageService.js
const { ChatRoom } = require('../models/ChatRoom'); // Assuming you have a Sequelize model defined for ChatRoom

async function createChatRoom(buyer, seller) {
    try {
        const chatRoom = await ChatRoom.create({ buyer, seller });
        console.log(chatRoom.toJSON()); // Optional: Log the created chatRoom details
        return chatRoom;
    } catch (error) {
        console.error('Error creating chat room:', error);
        throw error; // Handle the error as needed
    }
}

module.exports = {
    createChatRoom
};
