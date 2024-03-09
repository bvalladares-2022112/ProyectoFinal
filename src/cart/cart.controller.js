import Cart from './cart.model.js';
import Product from '../product/product.model.js';


export const add = async (req, res) => {
    try {
        const { custumer, productId, quantity } = req.body;
        let cart = await Cart.findOne({ custumer: custumer });
        if (!cart) {
            cart = new Cart({
                products: [],
                custumer: custumer
            });
        }
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }
        const productIndex = cart.products.findIndex(item => item.productId.toString() === productId.toString());
        if (productIndex !== -1) {
            cart.products[productIndex].quantity += parseInt(quantity);
            cart.products[productIndex].subTotal += (parseInt(quantity) * product.price);
        } else {
            cart.products.push({
                productId,
                quantity: parseInt(quantity),
                subTotal: parseInt(quantity) * product.price
            });
        }
        await cart.save();
        return res.send(cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};

export const deleteP = async (req, res) => {
    try {
        let customerId = req.user.id
        console.log(customerId);
        const { id } = req.params
        const { productId } = req.body;
        let cart = await Cart.findOne({ _id: id, custumer: customerId }).populate('custumer', 'name').populate('products.productId', 'name');
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }
        const productIndex = cart.products.findIndex(item => item.productId.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).send({ message: "Product not found in cart" });
        }
        cart.products.splice(productIndex, 1);
        await cart.save();
        return res.status(200).send(cart);
    } catch (error) {
        console.error('Error while deleting the product from the cart:', error);
        return res.status(500).send({ message: "Internal server error" });
    }
};



export const deleteCart = async (req, res) => {
    try {
        const { customerId } = req.params;
        await Cart.findOneAndDelete({ customer: customerId });
        return res.status(200).send({ message: "Cart deleted successfully" });
    } catch (error) {
        console.error('Error while deleting the shopping cart:', error);
        return res.status(500).send({ message: "Internal server error" });
    }
};



export const getCart = async (req, res) => {
    try {
        const { customerId } = req.params;
        const cart = await Cart.findOne({ customer: customerId }).populate('custumer', 'name').populate('products.productId', 'name');
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }
        return res.status(200).send(cart);
    } catch (error) {
        console.error('Error while retrieving the shopping cart:', error);
        return res.status(500).send({ message: "Internal server error" });
    }
};
