'use strict';

import Category from './category.model.js';
import Product from '../product/product.model.js';

export const initializeDefaultCategories = async () => {
    try {
        const defaultCategory = await Category.findOne({ name: 'Default' });
        if (!defaultCategory) {
            const defaultData = {
                name: 'Default',
                description: 'Default category'
            };
            const newDefaultCategory = new Category(defaultData);
            await newDefaultCategory.save();
            console.log('Default category created successfully');
        }
    } catch (error) {
        console.error('Error initializing default category:', error);
    }
};

// Llama a la función de inicialización al iniciar la aplicación
initializeDefaultCategories();

export const saveC = async (req, res) => {
    try {
        let data = req.body;
        let category = new Category(data);
        await category.save();
        return res.send({ message: 'Category saved successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error saving category' });
    }
};

export const getC = async (req, res) => {
    try {
        let categories = await Category.find();
        return res.send({ categories });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting categories' });
    }
};

export const updateC = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let updatedCategory = await Category.findOneAndUpdate({ _id: id }, data, { new: true });
        if (!updatedCategory) return res.status(404).send({ message: 'Category not found and not updated' });
        return res.send({ message: 'Category updated successfully', updatedCategory });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating category' });
    }
};

export const deleteC = async (req, res) => {
    try {
        let { id } = req.params;
        let deletedCategory = await Category.findOne({ _id: id });
        if (!deletedCategory) return res.status(404).send({ message: 'Category not found' });
        let defaultCategory = await Category.findOne({ name: 'Default' });
        if (!defaultCategory) return res.status(500).send({ message: 'Default category not found' });
        await Product.updateMany({ category: id }, { $set: { category: defaultCategory._id } });
        await Category.deleteOne({ _id: id });
        return res.send({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting category' });
    }
};

