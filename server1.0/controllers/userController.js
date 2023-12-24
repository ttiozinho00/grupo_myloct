// controllers/userController.js

const { Router } = require('express');
const router = Router();
const { User } = require('../models/User'); // Assuming you have a User model defined using Sequelize
const productService = require('../services/productService');
const userService = require('../services/userService');

router.patch('/edit-profile/:id', async (req, res) => 
{
    let { name, phoneNumber, email } = req.body;

    try 
    {
        let errors = [];
        let checkUser = await User.findOne({ where: { email } });

        if (checkUser && checkUser.id !== req.params.id)
        {
            errors.push('This email address is already in use; ');
        }

        if (name.length < 3 || name.length > 50)
        {
            errors.push('Name should be at least 3 characters long and max 50 characters long; ');
        }

        if (/^\([1-9]{2}\)(?:[2-8]|9[1-9])[0-9]{3}[0-9]{4}$/.test(phoneNumber) == false)
        {
            errors.push('Phone number should be a valid BG number; ');
        }

        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) == false)
        {
            errors.push("Please fill a valid email address; ");
        }

        if (req.body.avatar) 
        {
            if (!req.body.avatar.includes('image')) errors.push('The uploaded file should be an image; ');
        }

        if (errors.length >= 1)
        {
             throw { message: [errors] };
        }

        if (req.body.avatar) 
        {
            let compressedImg = await productService.uploadImage(req.body.avatar);
            await userService.edit(req.params.id, { name, phoneNumber, email, avatar: compressedImg });
            res.status(201).json({ message: 'Updated!', avatar: compressedImg });
        } 

        else 
        {
            await userService.edit(req.params.id, { name, phoneNumber, email });
            res.status(201).json({ message: 'Updated!' });
        }
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
})

router.get('/getUserById/:id', async (req, res) => {
    try 
    {
        let user = await userService.getUserById(req.params.id);
        let jsonRes = {
            _id: user.id, name: user.name, email: user.email, phoneNumber: user.phoneNumber,
            totalSells: user.createdSells.length, avatar: user.avatar,
            isMe: req.user.id == req.params.id
        }
        res.status(200).json({user: jsonRes});
    } catch (error) {
        res.status(500).json({ error });
    }
})

module.exports = router;
