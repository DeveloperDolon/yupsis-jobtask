import { NextFunction, Request, RequestHandler, Response } from 'express';

const notFound: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.status(404).json({
    succes: false,
    message: 'Route not found',
    error: '',
  });
  next();
};

export default notFound;
