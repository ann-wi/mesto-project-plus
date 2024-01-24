import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { JWT_SECRET } from 'config';
import { UNAUTHORIZED_ERROR_STATUS } from '../constants';

interface IAuthRequest extends Request {
  user?: string | JwtPayload
}

export const authMiddleware = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.body;

  if (!authorization || !authorization.startWith('Bearer ')) {
    return res.status(UNAUTHORIZED_ERROR_STATUS).send({ message: 'Incorrect login or password' });
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(UNAUTHORIZED_ERROR_STATUS).send({ message: 'Incorrect login or password' });
  }

  req.user = payload as { _id: JwtPayload };
  next();
};

