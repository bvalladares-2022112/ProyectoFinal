import { Router } from 'express';
import { add, getCart, deleteCart, deleteP } from './cart.controller.js';
import { validateJwt, isClient } from '../middlewares/validate-jwt.js';

const api = Router();

api.post('/add', [validateJwt, isClient], add);
api.get('/:userId', [validateJwt, isClient], getCart);
api.delete('/:deleteCart', [validateJwt, isClient], deleteCart);
api.delete('/deleteP/:id' , [validateJwt, isClient], deleteP);

export default api;
