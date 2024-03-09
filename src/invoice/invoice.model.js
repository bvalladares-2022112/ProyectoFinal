import { Schema, model } from 'mongoose'

const invoiceSchema = Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    date: {
        type: Date,
        default: Date.now(),
        required: true
    },
    cart: {
        type: Schema.Types.ObjectId,
        ref: 'cart',
        required: true
    },
    total: {
        type: Number,
        required: true
    }
}, {
    versionKey: false
})

export default model('invoice', invoiceSchema)