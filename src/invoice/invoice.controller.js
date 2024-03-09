'use strict';

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import Invoice from './invoice.model.js';
import Product from '../product/product.model.js';
import Cart from '../cart/cart.model.js';

export const generateInvoice = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartId = req.params.cartId;
        console.log(cartId)
        const cart = await Cart.findOne({ _id: cartId, custumer: userId }).populate('products.productId');
        if (!cart) {
            return res.status(404).send({ message: 'Cart not found' });
        }
        const total = cart.products.reduce((acc, item) => {
            const subTotal = item.productId.price * item.quantity;
            item.subTotal = subTotal;
            return acc + subTotal;
        }, 0);

        for (const item of cart.products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).send({ message: 'Product not found' });
            }
            if (product.stock < item.quantity) {
                return res.status(400).send({ message: `Insufficient stock for ${product.name}` });
            }
            product.stock -= item.quantity;
            await product.save();
        }

        const invoice = new Invoice({
            user: userId,
            cart: cartId,
            total,
        });
        await invoice.save();

        const pdfDoc = new PDFDocument();
        pdfDoc.pipe(fs.createWriteStream(`invoice_${invoice._id}.pdf`));
        pdfDoc
            .fontSize(20)
            .text('Invoice', { align: 'left' });
        // User Details
        pdfDoc.moveDown();
        pdfDoc
            .fontSize(14)
            .text('User Information', { align: 'center' });
        pdfDoc.moveDown();
        pdfDoc
            .fontSize(12)
            .text(`User Name: ${req.user.name}`)
            .text(`Email: ${req.user.email}`)
            .text(`Phone: ${req.user.phone}`);
        pdfDoc.moveDown();
        pdfDoc.moveTo(50, pdfDoc.y)
            .lineTo(550, pdfDoc.y)
            .stroke();
        // Product Details
        pdfDoc.moveDown();
        pdfDoc
            .fontSize(14)
            .text('Purchase', { align: 'left' });
        cart.products.forEach((item, index) => {
            pdfDoc.moveDown();
            const productDetails = `Product #${index + 1} | Name: ${item.productId.name} | Description: ${item.productId.description} | Price: Q.${item.productId.price} | Quantity: ${item.quantity} | Subtotal: Q.${item.subTotal}`;
            pdfDoc
                .fontSize(12)
                .text(productDetails);
        });
        pdfDoc.moveDown(2);
        pdfDoc
            .fontSize(16)
            .text('Thank you for your purchase!', { align: 'center' });
        // Separation Line
        pdfDoc.moveDown();
        pdfDoc.moveTo(50, pdfDoc.y)
            .lineTo(550, pdfDoc.y)
            .stroke();
        // Total
        pdfDoc.moveDown();
        pdfDoc
            .fontSize(16)
            .text(`Total: Q.${total}`, { align: 'right' });

        pdfDoc.end();


        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=invoice_${invoice._id}.pdf`);

        const fileStream = fs.createReadStream(`invoice_${invoice._id}.pdf`);
        fileStream.pipe(res);

        for (const item of cart.products) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).send({ message: 'Product not found' });
            }
            product.sold += item.quantity;
            await product.save();
        }
    } catch (err) {
        console.error(err);
        res.status(500).send({ message: 'Error creating invoice and generating PDF' });
    }
};

export const invoicesHistory = async (req, res) => {
    try {
        const userId = req.user.id;
        const invoices = await Invoice.find({ user: userId });
        res.status(200).json({ invoices });
    } catch (error) {
        console.error('Error al obtener el historial de facturas:', error);
        res.status(500).json({ message: 'Error al obtener el historial de facturas' });
    }
};
