// config/config.js
const { Sequelize, DataTypes } = require('sequelize');

// Configuration
const config = {
  PORT: process.env.PORT || 3306,
  DB_CONNECTION: {
    username: 'root',
    password: 'Douglas123@',
    database: 'myloct',
    host: 'localhost',
    dialect: 'mysql',
  }
};

// Sequelize connection
const sequelize = new Sequelize(
  config.DB_CONNECTION.database,
  config.DB_CONNECTION.username,
  config.DB_CONNECTION.password, {
    host: config.DB_CONNECTION.host,
    dialect: config.DB_CONNECTION.dialect,
  }
);

// Function to test the database connection
const testDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Test the database connection
//testDatabaseConnection();

module.exports = { sequelize, config };
