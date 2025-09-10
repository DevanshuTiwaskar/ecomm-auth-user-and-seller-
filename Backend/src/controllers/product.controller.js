const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model');
const storageService = require("../services/storage.service")
const productModel = require("../models/product.model")

async function createProduct(req, res) {

    const price = req.body.price ? JSON.parse(req.body.price) : null;

    const seller = req.seller
    const { title, description, stock } = req.body;

    const files = await Promise.all(req.files.map(async (file) => {
        return await storageService.uploadFile(file.buffer)
    }))

    const product = await productModel.create({
        title: title,
        description: description,
        price: {
            amount: price?.amount,
            currency: price?.currency || "INR"
        },
        images: files.map(i => i.url),
        seller: seller._id,
        stock: parseInt(stock) || 0
    })

    res.status(201).json({
        message: "product created successfully",
        product
    })

}


async function getSellerProducts(req, res) {

    const seller = req.seller;

    const products = await productModel.find({
        seller: seller._id
    })

    res.status(200).json({
        message: "seller products fetched successfully",
        products
    })


}


async function getAllProduct(req,res){

    const page = req.query.page ? parseInt(req.query.page) : 1
    
  const products = await productModel.find()
  .skip((page - 1) * 5)
  .limit(5)
    


   res.status(200).json({
    message: "all product fetched successfully",
    products
   })
}


async function getProductDetails(req, res) {
  try {
    const { id } = req.params;
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "product not found",
      });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({
      message: "error fetching product details",
      error: error.message,
    });
  }
}


module.exports = {
    createProduct,
    getSellerProducts,
    getAllProduct,
    getProductDetails
}