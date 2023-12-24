// services/authService.js

const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Sequelize } = require('sequelize');

// Sequelize configuration
const sequelize = new Sequelize({
    dialect: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'Douglas123@',
    database: 'myloct',
});

// User model
const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [3, 50]
        }
    },
    phoneNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            is: /^\([1-9]{2}\)(?:[2-8]|9[1-9])[0-9]{3}[0-9]{4}$/
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
    gender: {
        type: DataTypes.STRING,
        allowNull: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: [8, 20]
        }
    },
    repeatPassword: {
        type: DataTypes.STRING,
        allowNull: false
    }
});

// Profile model
const Profile = sequelize.define('Profile', {
    bio: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

// Define association between User and Profile
User.hasOne(Profile);
Profile.belongsTo(User);

// Hash password before saving
User.beforeCreate(async (user) => {
    user.password = await bcrypt.hash(user.password, 10);
});

// User functions
async function registerUser(userData) 
{
    try 
    {
        const user = await User.create(userData);
        return user;
    } catch (error) {
        throw error;
    }
}

async function loginUser({ email, password }) 
{
    try 
    {
        const user = await User.findOne({ where: { email } });
        if (!user)
        {
            throw { message: 'Invalid email or password' };
        }

        const hasValidPass = await bcrypt.compare(password, user.password);
        if (!hasValidPass)
        {
            throw { message: 'Invalid email or password' };
        }

        const token = jwt.sign(
            { _id: user.id, email: user.email, createdSells: user.createdSells.length, avatar: user.avatar },
            'your-secret-key' // Replace with your actual secret key
        );
        return token;
    } catch (error) {
        throw error;
    }
}

async function getUser(id) 
{
    try 
    {
        const user = await User.findByPk(id, 
        {
            include: Profile // Include associated profile
        });
        return user.toJSON();
    } catch (error) {
        throw error;
    }
}

module.exports = {registerUser,loginUser,getUser};
