const express = require('express');
const router = express.Router();
const Category = require('../models/category'); // Matches your lowercase filename

router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching categories', error: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, description } = req.body;
        
        if (!name) {
            return res.status(400).json({ message: 'Category name is required' });
        }

        const newCategory = new Category({ name, description });
        await newCategory.save();
        
        res.status(201).json({ message: 'Category created successfully', category: newCategory });
    } catch (error) {
        res.status(500).json({ message: 'Server error creating category', error: error.message });
    }
});

module.exports = router;