import { Router } from 'express';

const router = Router();

const moduleRoutes = [];

moduleRoutes.forEach((route) => router.use(route.path, route.router));

export default router;
