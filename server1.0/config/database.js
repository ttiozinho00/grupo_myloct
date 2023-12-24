// config/database.js
const { Sequelize } = require('sequelize');
const config = require('./config');

const sequelize = new Sequelize({
  dialect: config.config.DB_CONNECTION.dialect,  // Correctly access the dialect property
  host: config.config.DB_CONNECTION.host,
  port: config.config.DB_CONNECTION.port,
  username: config.config.DB_CONNECTION.username,
  password: config.config.DB_CONNECTION.password,
  database: config.config.DB_CONNECTION.database,
  logging: config.NODE_ENV === 'development',
});

const testDatabaseConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
  }
};

module.exports = {
  sequelize,
  testDatabaseConnection,
};
