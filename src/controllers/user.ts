import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from 'config';
import User from '../models/user';
import { TypeUser } from '../types';
import { SUCCESSFUL_REQUEST_STATUS } from '../constants';
import NotFoundError from '../errors/not-found-error';
import ValidationError from 'errors/validation-error';
import UnauthorizedError from 'errors/unauthorized-error';
import ConflictError from 'errors/conflict-error';

type TUser = {
  name?: string;
  about?: string;
  avatar?: string;
};

type TUserId = string;

function updateUserProfile(userId: TUserId, data: TUser) {
  return User.findByIdAndUpdate(userId, data, {
    new: true,
    runValidators: true,
  });
}

export const getUser = (req: TypeUser, res: Response, next: NextFunction) => {
  User.findById(req.user?._id)
    .then((user) => {
      if (user) {
        res.status(SUCCESSFUL_REQUEST_STATUS).send({ user });
      }
      next((new NotFoundError('User with this ID is not found')));
    })
    .catch((err) => next(err));
};

export const getUsers = (req: Request, res: Response, next: NextFunction) => {
  User.find({})
    .then((users) => res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: users }))
    .catch((err) => next(err));
};

export const getUserById = (req: Request, res: Response, next: NextFunction) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(SUCCESSFUL_REQUEST_STATUS).send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        });
        return;
      }
      next((new NotFoundError('User with this ID is not found')));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next((new ValidationError('Invalid ID format')));
      }
      return next(err);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;

  return bcrypt.hash(password, 10)
    .then((hash: string) => User.create({ name, about, avatar, email, password: hash, }))
    .then((user) => res.status(SUCCESSFUL_REQUEST_STATUS).send({
      name: user.name,
      about: user.about,
      email: user.email,
      avatar: user.avatar,
      _id: user._id,
      message: 'New user was created',
    }))
    .catch((err) => {
      if (err.code === 11000) {
        next((new ConflictError('User with this email already exists')));
      }
      if (err instanceof mongoose.Error.ValidationError) {
        next((new ValidationError('New user data is incorrect')));
      }
      next(err);
    });
};

export const loginUser = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      res.send({ token });
    })
    .catch(() => {
      next((new UnauthorizedError('Incorrect login or password')));
    });
};

export const updateUser = (req: TypeUser, res: Response, next: NextFunction) => {
  const { name, about } = req.body;

  return updateUserProfile(req.user?._id, { name, about })
    .then((user) => {
      if (user) {
        res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: user });
      }
      next((new NotFoundError('User with this ID is not found')));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next((new ValidationError('New profile data is incorrect')));
      }
      next(err);
    });
};

export const updateUserAvatar = (req: TypeUser, res: Response, next: NextFunction) => {
  const { avatar } = req.body;

  return updateUserProfile(req.user?._id, { avatar })
    .then((user) => {
      if (user) {
        res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: user });
      }
      next((new NotFoundError('User with this ID is not found')));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next((new ValidationError('New avatar data is incorrect')));
      }
      next(err);
    });
};
