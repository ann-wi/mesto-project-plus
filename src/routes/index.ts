import {
  NextFunction,
  Request,
  Response,
  Router,
} from 'express';
import NotFoundError from '../errors/not-found-error';

const router = Router();

router.use((req: Request, res: Response, next: NextFunction) => {
  next((new NotFoundError('Page is not found')));
});

export default router;
