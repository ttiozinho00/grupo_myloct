// models/product.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User'); // Import the User model

const Product = sequelize.define('Product', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
        notEmpty: true,
        len: [3, 50],
        },
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
        notEmpty: true,
        isIn: [['category1', 'category2', 'category3']], // Replace with your actual categories
        },
    },
    description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
        notEmpty: true,
        len: [10, 1000],
        },
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    addedAt: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    sellerId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
        model: 'User',
        key: 'id',
        },
    },
   active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'Products' // Mova esta linha para fora do bloco de definição de colunas
});

// Define associations
Product.belongsTo(User, { foreignKey: 'sellerId', as: 'seller' });
User.hasMany(Product, { foreignKey: 'sellerId', as: 'products' });


module.exports = Product;



