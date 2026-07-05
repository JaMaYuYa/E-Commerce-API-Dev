const express = require('express');
const router = express.Router();
const Product = require('../models/product'); // Using your lowercase filename

router.get('/', async (req, res) => {
    try {
        const { search, category } = req.query;
        let queryObject = {};

        if (search) {
            queryObject.name = { $regex: search, $options: 'i' };
        }

        if (category) {
            queryObject.category = category;
        }

        const products = await Product.find(queryObject);
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching filtered products', error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching product', error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, price, description, category, stock } = req.body;
        
        if (!name || !price || !category) {
            return res.status(400).json({ message: 'Name, price, and category are required' });
        }

        const newProduct = new Product({ name, price, description, category, stock });
        await newProduct.save();
        
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        res.status(500).json({ message: 'Server error creating product', error: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } // "new: true" returns the modified document immediately
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found to update' });
        }

        res.status(200).json({ message: 'Product updated successfully', product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: 'Server error updating product', error: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found to delete' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting product', error: error.message });
    }
});

module.exports = router;