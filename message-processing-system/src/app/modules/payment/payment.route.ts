import express from 'express';
import { PaymentController } from './payment.controller';

const routes = express.Router();

routes.post('/add', PaymentController.addPayment);

routes.get('/list', PaymentController.payments);

export const PaymentRouter = routes;
