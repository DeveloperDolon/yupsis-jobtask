import { Router } from 'express';
import { PaymentRouter } from '../modules/payment/payment.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/payment',
    router: PaymentRouter,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.router));

export default router;
