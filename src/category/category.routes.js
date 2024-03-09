'use strict';

import { Router } from 'express';
import { deleteC, getC, saveC, updateC } from './category.controller.js';
import { isAdmin, validateJwt } from '../middlewares/validate-jwt.js';

const api = Router();

api.post('/saveC', [validateJwt], [isAdmin], saveC);
api.get('/getC', getC);
api.put('/updateC/:id', [validateJwt], [isAdmin], updateC);
api.delete('/deleteC/:id', [validateJwt], [isAdmin], deleteC);

export default api;
