import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import globalErrorHandler from './app/middleware/globalErrorHandler';
import notFound from './app/middleware/notFound';
import passport from 'passport';
import './app/utiils/passport';
// import router from './app/routes';
import { rateLimit } from 'express-rate-limit';
import router from './app/routes';

const app: Application = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

app.use(limiter);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello world from sparktech backend!');
});

app.get(
  '/protected',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      message: 'welcome to the protected route!',
    });
  },
);

app.use('/', router);

app.use(globalErrorHandler);

app.use(notFound);

export default app;
