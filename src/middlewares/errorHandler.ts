import { Request, Response } from 'express';

const errorHandler = (err: any, req: Request, res: Response) => {
  const { statusCode = 500, message } = err;

  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Internal Server Error'
      : message,
  });
};

export default errorHandler;