import jwt, { JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { JWT_SECRET } from '../config';
import UnauthorizedError from '../errors/unauthorized-error';

interface IAuthRequest extends Request {
  user?: string | JwtPayload
}

export const authMiddleware = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.body;

  if (!authorization || !authorization.startWith('Bearer ')) {
    return next((new UnauthorizedError('Incorrect login or password')));
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next((new UnauthorizedError('Incorrect login or password')));
  }

  req.user = payload as { _id: JwtPayload };
  next();
};
