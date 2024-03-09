import { checkUpdate } from '../utils/validator.js';
import Product from './product.model.js';

export const save = async (req, res) => {
    try {
        let data = req.body;
        let product = new Product(data);
        await product.save();
        return res.status(201).send({ message: 'Product created successfully', product });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error creating product', error: err });
    }
};

export const get = async (req, res) => {
    try {
        let products = await Product.find();
        return res.send({ products });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting products' });
    }
};

export const update = async (req, res) => {
    try {
        let data = req.body;
        let { id } = req.params;
        let update = checkUpdate(data, false);
        if (!update) return res.status(400).send({ message: 'Have submitted some data that cannot be updated or missing data' });
        let updatedProduct = await Product.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        );
        if (!updatedProduct) return res.status(404).send({ message: 'Product not found and not updated' });
        return res.send({ message: 'Product updated successfully', updatedProduct });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error updating product' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        let { id } = req.params;
        let deletedProduct = await Product.deleteOne({ _id: id });
        if (deletedProduct.deletedCount === 0) return res.status(404).send({ message: 'Product not found and not deleted' });
        return res.send({ message: 'Deleted product successfully' });
    } catch (err) {
        console.error(err);
        return res.status(404).send({ message: 'Error deleting product' });
    }
};

export const search = async (req, res) => {
    try {
        let { search } = req.body;
        let products = await Product.find(
            { name: { $regex: new RegExp(search, 'i') } } // 'i' hace que la búsqueda no distinga entre mayúsculas y minúsculas
        );
        if (!products || products.length === 0) {
            return res.status(404).send({ message: 'Products not found' });
        }
        return res.send({ message: 'Products found', products });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error searching products' });
    }
};


export const getO = async (req, res) => {
    try {
        let outOfStockProducts = await Product.find({ stock: 0 });
        return res.send({ outOfStockProducts });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting out of stock products' });
    }
};

export const getM = async (req, res) => {
    try {
        let mostSoldProducts = await Product.find().sort({ sold: -1 });
        return res.send({ mostSoldProducts });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting most sold products' });
    }
};

export const getByCategory = async (req, res) => {
    try {
       let data = await Product.find().populate('categoryId')
       return res.send({ data })
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error getting products by category ID' });
    }
};




