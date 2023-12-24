// models/User.js
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const { SALT } = require('../config/config');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 50] // Ajustado para um comprimento mínimo de 3 e máximo de 50 caracteres
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [11, 255] // Ajustado para um comprimento mínimo de 11 e máximo de 255 caracteres
        }
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^\([1-9]{2}\)(?:[2-8]|9[1-9])[0-9]{3}[0-9]{4}$/ // Preservado o regex fornecido
        }
    },
    gender: {
        type: DataTypes.STRING,
        defaultValue: 'Not specified'
    },
    avatar: {
        type: DataTypes.STRING,
        defaultValue: 'https://res.cloudinary.com/silenceiv/image/upload/q_auto:eco/v1617358367/defaultAvatar_wnoogh.png'
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            const salt = await bcrypt.genSalt(SALT);
            const hash = await bcrypt.hash(user.password, salt);
            user.password = hash;
        }
    },
    tableName: 'Users' // Mova esta linha para fora do bloco de opções dos hooks
});

module.exports = User;



