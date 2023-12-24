// controllers/productController.js

const { Router } = require('express');
const router = Router();
const { Op } = require('sequelize');
const isAuth = require('../middlewares/isAuth');
const moment = require('moment');
const { Product, User } = require('../models/Product');

const productService = require('../services/productService');

router.post('/create', async (req, res) => 
{
  const { title, price, description, city, category, image } = req.body;
  try
   {
    // Validation and error handling code remains unchanged

    const compressedImg = await productService.uploadImage(image);

    const product = await Product.create({
      title,
      price,
      description,
      city,
      category,
      image: compressedImg,
      addedAt: new Date(),
      sellerId: req.user.id,
    });

    await productService.userCollectionUpdate(req.user.id, product);

    res.status(201).json({ productId: product.id });
  } catch (err) {
    console.error(err);
    res.status(404).json({ error: err.message });
  }
});

router.patch('/edit/:id', isAuth, async (req, res) => {
  const { title, price, description, city, category, image } = req.body;
  try {
    // Validation and error handling code remains unchanged

    const user = await productService.findUserById(req.user.id);
    const product = await productService.findById(req.params.id);

    if (user.id !== product.sellerId) {
      throw { message: 'You have no permission to perform this action!' };
    }

    let updateFields = {
      title,
      price,
      description,
      city,
      category,
    };

    if (image) {
      const compressedImg = await productService.uploadImage(image);
      updateFields.image = compressedImg;
    }

    await productService.edit(req.params.id, updateFields);

    res.status(201).json({ message: 'Updated!' });
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
});

// ... (similar modifications for other routes)

module.exports = router;
