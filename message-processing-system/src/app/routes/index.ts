import { Router } from 'express';
import { UserRoutes } from '../modules/User/user.routes';

const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    router: UserRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.router));

export default router;
