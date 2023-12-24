//config/express.js

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { sequelize, testDatabaseConnection } = require('./database');

module.exports = (app) => {
  // Add middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(cors());

  // Your other app configuration and middleware setup goes here

  // Add the sequelize instance to the app for easy access in routes/controllers
  app.set('sequelize', sequelize);

  // Test the database connection (moved to server startup)
  app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is running...`);
    testDatabaseConnection();
  });
};
