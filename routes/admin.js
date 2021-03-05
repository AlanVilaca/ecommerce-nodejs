const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const Product = require('../models/product');
const User = require('../models/user');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.post('/admin/category', async (req,res)=>{
    const {name} = req.body.category;
    const used_category = await Category.findCategory(name);
    if(!used_category){
        const newCategoy = new Category({
            name
        });
        newCategoy.save().then(()=>{
            res.status(201).send({msg: "Category created", user: req.userID});
        }).catch(err=>{
            res.status(400).send({msg: err})
        })
    }else{
        res.status(400).send({msg: "Category name is already taken"})
    }
})

router.post('/admin/product', async(req, res)=>{
    const categoryId = req.body.product.category;
    //console.log(categoryId);
    const category = await Category.findById({_id: categoryId});
    console.log(category);
    const {name} = req.body.product;
    console.log(name);
    const used_product = await Product.findProduct(name);
    console.log(used_product);
    if(!used_product){
        
        const newProduct = new Product({name});
        newProduct.category = category;
        await newProduct.save();

        category.products.push(newProduct);
        await category.save();

        res.status(201).json(newProduct);
    }
})

router.get('/admin/products/:productId', async (req, res)=>{
    const {productId} = req.params;
    const product = await Product.findById({_id: productId}).populate('category', 'name');
    res.status(200).json({product})
})

module.exports = router;