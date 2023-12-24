// services/userService.js

const { Sequelize, DataTypes } = require('sequelize');

// Assuming you have a MySQL database running and the appropriate credentials
const sequelize = new Sequelize('myloct', 'root', 'Douglas123@', {
  host: 'localhost',
  dialect: 'mysql',
});

// Define User model
const User = sequelize.define('User', {
  // Define your user model fields here
  // Example:
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // Add other fields as needed
});

// Edit function
async function edit(userId, userData) {
  const user = await User.findByPk(userId);
  if (user) {
    await user.update(userData);
    return user;
  } else {
    throw new Error('User not found');
  }
}

// Get user by ID function
async function getUserById(userId) {
  return await User.findByPk(userId, {
    include: 'createdSells', // Adjust based on your Sequelize associations
    raw: true, // To get plain JSON instead of Sequelize instance
  });
}

// Synchronize the model with the database
(async () => {
  try {
    await sequelize.sync();
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
})();

module.exports = {
  edit,
  getUserById,
};
