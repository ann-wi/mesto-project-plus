import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import { TypeUser } from '../types';
import {
  SUCCESSFUL_REQUEST_STATUS, BAD_REQUEST_STATUS, NOT_FOUND_STATUS, INTERNAL_SERVER_ERROR_STATUS,
} from '../constants';

export const getCards = (req: Request, res: Response) => {
  Card.find({})
    .then((cards) => res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: cards }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Internal Error' }));
};

export const createCard = (req: TypeUser, res: Response) => {
  const { name, link } = req.body;
  console.log(req.user?._id);

  Card.create({ name, link, owner: req.user?._id })
    .then((card) => {
      res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: card });
      return res.status(SUCCESSFUL_REQUEST_STATUS).send({ message: 'A new card was created' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_STATUS).send({ message: 'New card data is incorrect' });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Internal Error' });
    });
};

export const deleteCardById = (req: TypeUser, res: Response) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (card && card.owner.toString() === req.user?._id) {
        return res.status(SUCCESSFUL_REQUEST_STATUS).send({ message: 'Card was deleted' });
      }
      return res.status(NOT_FOUND_STATUS).send({ message: 'Card with this ID is not found' });
    })
    .catch(() => res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Internal Error' }));
};

export const likeCard = (req: TypeUser, res: Response) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user?._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: card });
        return;
      }
      return res.status(NOT_FOUND_STATUS).send({ message: 'Card with this ID is not found' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_STATUS).send({ message: 'Like data is incorrect' });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Internal Error' });
    });
};

export const dislikeCard = (req: TypeUser, res: Response) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user?._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: card });
        return;
      }
      return res.status(NOT_FOUND_STATUS).send({ message: 'Card with this ID is not found' });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST_STATUS).send({ message: 'Dislike data is incorrect' });
      }
      return res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Internal Error' });
    });
};
