import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';
import { TypeUser } from '../types';
import {
  SUCCESSFUL_REQUEST_STATUS, BAD_REQUEST_STATUS, NOT_FOUND_STATUS, INTERNAL_SERVER_ERROR_STATUS,
} from '../constants';

type TUser = {
  name?: string;
  about?: string;
  avatar?: string;
};

type TUserId = string;

function updateUserProfile(userId: TUserId, data: TUser) {
  return User.findByIdAndUpdate(userId, data, {
    new: true,
  });
}

export const getUsers = (req: Request, res: Response) => {
  User.find({})
    .then((users) => res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: users }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Internal Error' }));
};

export const getUserById = (req: Request, res: Response) => {
  User.findById(req.params.id)
    .then((user) => {
      if (user) {
        res.status(SUCCESSFUL_REQUEST_STATUS).send({
          name: user.name,
          about: user.about,
          avatar: user.avatar,
          _id: user._id,
        });
      }
      return res.status(NOT_FOUND_STATUS).send({ message: 'User with this ID is not found' });
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Internal Error' }));
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: user });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_STATUS).send({ message: 'New user data is incorrect' });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Internal Error' });
    });
};

export const updateUser = (req: TypeUser, res: Response) => {
  const { name, about } = req.body;

  return updateUserProfile(req.user?._id, { name, about })
    .then((user) => {
      if (user) {
        res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: user });
      }
      return res.status(NOT_FOUND_STATUS).send({ message: 'User with this ID is not found' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_STATUS).send({ message: 'New user data is incorrect' });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Internal Error' });
    });
};

export const updateUserAvatar = (req: TypeUser, res: Response) => {
  const { avatar } = req.body;

  return updateUserProfile(req.user?._id, { avatar })
    .then((user) => {
      if (user) {
        res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: user });
      }
      return res.status(NOT_FOUND_STATUS).send({ message: 'User with this ID is not found' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_STATUS).send({ message: 'New user data is incorrect' });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Internal Error' });
    });
};
