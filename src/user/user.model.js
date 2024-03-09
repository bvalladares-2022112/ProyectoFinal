import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        minLength: [8, 'Password must be 8 characters'],
        required: true
    },
    email: {
        type:String,
        required: true
    },
    phone: {
        type: String,
        minLenght: 8,
        maxLenght: 8,
        required: true
    },
    role: {
        type: String,
        Uppercase: true,
        enum: ['ADMIN', 'CLIENT'],
        required: true
    }
})

export default mongoose.model('user', userSchema)