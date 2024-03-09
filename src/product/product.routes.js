'use strict';

import { Router } from 'express';
import { deleteProduct, get, save, search, update, getO, getM, getByCategory } from './product.controller.js';
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js';

const api = Router();

api.post('/save/', [validateJwt], [isAdmin], save);
api.get('/get', get);
api.put('/update/:id', [validateJwt], [isAdmin], update);
api.delete('/delete/:id', [validateJwt], [isAdmin], deleteProduct);
api.post('/search', search);
api.get('/getO', [validateJwt],  getO);
api.get('/getM', [validateJwt],  getM);
api.get('/getByCategory/:id', getByCategory); 

export default api;
