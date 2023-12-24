// controllers/uthController.js

const path = require('path');
const router = require('express').Router();
const authService = require('../services/authService');

// Adapte o caminho para o modelo User conforme a estrutura real do seu projeto
const { User } = require('../models/User');
const { SECRET, COOKIE_NAME } = require('../config/config'); // Certifique-se de que COOKIE_NAME está definido
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const { id } = await authService.registerUser(req.body);
        res.status(201).json({ _id: id });
    } catch (error) {
        console.error(error);
        res.status(404).json({ error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const token = await authService.loginUser(req.body);
        const decoded = jwt.verify(token, SECRET);
        
        res.status(200)
            .cookie(COOKIE_NAME, token, { sameSite: 'none', secure: true, httpOnly: true })
            .json({ user: decoded });
    } catch (error) {
        res.clearCookie(COOKIE_NAME);
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/logout', (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.status(200).json({ message: 'Successfully logged out' });
});

router.get('/getUser', async (req, res) => {
    try {
        if (req.user) {
            const { id, name, email, phoneNumber, createdSells, avatar } = await User.findByPk(req.user.id);
            res.status(200).json({
                user: {
                    _id: id,
                    name,
                    email,
                    phoneNumber,
                    createdSells: createdSells.length,
                    avatar
                }
            });
        } else {
            res.status(200).json({ message: 'Not logged in' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
