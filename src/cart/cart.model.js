import mongoose from 'mongoose';

const { Schema } = mongoose;

const cartSchema = new Schema({
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: 'product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        subTotal: {
            type: Number,
            required: true,
            default: 0
        },
    }],
    custumer: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
