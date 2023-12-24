const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ChatRoom = sequelize.define('ChatRoom', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    buyerId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    sellerId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
}, {
    tableName: 'ChatRooms' // Mova esta linha para dentro do bloco de definição do modelo
});

const Conversation = sequelize.define('Conversation', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    chatRoomId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'ChatRooms',
            key: 'id'
        }
    },
    senderId: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Users',
            key: 'id'
        }
    },
    message: {
        type: DataTypes.STRING,
        trim: true
    },
},{
    tableName: 'Conversation'
});

// Define associations
ChatRoom.hasMany(Conversation, { foreignKey: 'chatRoomId' });
Conversation.belongsTo(ChatRoom, { foreignKey: 'chatRoomId' });

module.exports = { ChatRoom, Conversation };
