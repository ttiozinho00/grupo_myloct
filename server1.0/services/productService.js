//  services/productService.js
const { Product } = require('../models/Product'); // Assuming you have Sequelize models defined
const { User } = require('../models/User'); // Assuming you have Sequelize models defined
const multer = require('multer');

// Set up Multer storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

async function getAll() {
    return await Product.findAll();
}

async function findByCategory(category) {
    return await Product.findAll({ where: { category: category } });
}

async function findById(id) {
    return await Product.findByPk(id);
}

async function edit(id, data) {
    return await Product.update(data, { where: { id: id } });
}

async function create(data, userId) {
    const product = await Product.create(data);
    await User.update({ createdSells: product.id }, { where: { id: userId } });
    return product;
}

//emplemente essa função
async function uploadImage(req) {
    return new Promise((resolve, reject) => {
        upload.single('image')(req, null, async function (err) 
        {

            if (err) 
            {
                reject(err);
            } 

            else 
            {
                try {
                    // Here, you can handle the image upload logic
                    // You might want to use a cloud storage service like AWS S3, Google Cloud Storage, etc.
                    // For simplicity, let's assume you save the image locally

                    const imageUrl = `uploads/${Date.now()}_${req.file.originalname}`;

                    // Save the image file to the server
                    // You should replace this with your actual logic for handling image storage
                    const fs = require('fs');
                    fs.writeFileSync(imageUrl, req.file.buffer);

                    resolve(imageUrl);
                } catch (error) {
                    reject(error);
                }
            }
        });
    });
}

async function userCollectionUpdate(userId, product) {
    await User.update({ createdSells: product.id }, { where: { id: userId } });
}

async function findUserById(id) {
    return await User.findByPk(id);
}

module.exports = {create,getAll,findByCategory,findById,edit,uploadImage,userCollectionUpdate,findUserById};