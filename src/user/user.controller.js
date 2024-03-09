'use strict';

import User from './user.model.js';
import { encrypt, checkPassword, checkUpdate } from '../utils/validator.js';
import { generateJwt } from '../utils/jwt.js';

export const initializeDefaultAdmin = async () => {
    try {
        const defaultAdmin = await User.findOne({ username: 'bvalladares' }); 
        if (!defaultAdmin) {
            const defaultData = {
                name: 'Brener',
                surname: 'Valladares',
                username: 'bvalladares',
                email: 'bvalladares@gmail.com',
                password: '12345678', 
                phone: '12345678',
                role: 'ADMIN'
            };
            defaultData.password = await encrypt(defaultData.password); // Aquí asignamos el valor cifrado a la contraseña
            const newDefaultAdmin = new User(defaultData);
            await newDefaultAdmin.save();
            console.log('Default Admin created successfully');
        } else {
            console.log('Default Admin already exists');
        }
    } catch (error) {
        console.error('Error initializing default admin:', error);
    }
};

initializeDefaultAdmin();


export const test = (req, res) => {
    console.log('Test is running');
    return res.send({ message: 'Test is running' });
};

export const register = async (req, res) => {
    try {
        let data = req.body;
        data.password = await encrypt(data.password);
        data.role = 'CLIENT';
        let user = new User(data);
        await user.save();
        return res.send({ message: `Registered successfully, can log in with username: ${user.username}` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error registering user', err: err.errors });
    }
};


export const login = async (req, res) => {
    try {
        let data = req.body;
        let user = await User.findOne({ $or: [{ username: data.username }, { email: data.email }] });
        if (user && await checkPassword(data.password, user.password)) {
            let loggedUser = {
                uid: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            };
            let token = await generateJwt(loggedUser);
            return res.send(
                {
                    message: `Welcome ${loggedUser.username}`,
                    loggedUser,
                    token
                }
            );
        }
        return res.status(401).send({ message: 'Invalid credentials provided' });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Login attempt failed' });
    }
};


export const update = async (req, res) => {
    try {
        let { id } = req.params;
        let data = req.body;
        let update = checkUpdate(data, id);
        if (!update) return res.status(400).send({ message: 'Some submitted data cannot be updated' });
        let updatedUser = await User.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        );
        if (!updatedUser) return res.status(401).send({ message: 'User not found and not updated' });
        return res.send({ message: 'User updated', updatedUser });
    } catch (err) {
        console.error(err);
        if (err.keyValue.username) return res.status(400).send({ message: `Username ${err.keyValue.username} is already taken` });
        return res.status(500).send({ message: 'Error updating account' });
    }
};


export const deleteU = async (req, res) => {
    try {
        let { id } = req.params;
        let deletedUser = await User.findOneAndDelete({ _id: id });
        if (!deletedUser) return res.status(404).send({ message: 'User not found and not deleted' });
        return res.send({ message: `Account with username ${deletedUser.username} deleted successfully` });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ message: 'Error deleting account' });
    }
};
