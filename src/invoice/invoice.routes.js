'use strict';

import { Router } from 'express';
import { generateInvoice, invoicesHistory } from './invoice.controller.js';
import { validateJwt } from '../middlewares/validate-jwt.js';

const api = Router();

api.get('/generateInvoice/:cartId', [validateJwt], generateInvoice);
api.get('/invoices', [validateJwt], invoicesHistory);

export default api;
