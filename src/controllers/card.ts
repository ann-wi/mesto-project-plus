import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import { TypeUser } from '../types';
import { SUCCESSFUL_REQUEST_STATUS } from '../constants';
import ValidationError from '../errors/validation-error';
import NotFoundError from '../errors/not-found-error';
import ForbiddenError from '../errors/forbidden-error';

export const getCards = (req: Request, res: Response, next: NextFunction) => {
  Card.find({})
    .then((cards) => res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: cards }))
    .catch((err) => next(err));
};

export const createCard = (req: TypeUser, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  console.log(req.user?._id);

  Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: card, message: 'A new card was created' }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next((new ValidationError('New card data is incorrect')));
      }
      next(err);
    });
};

export const deleteCardById = (req: TypeUser, res: Response, next: NextFunction) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Card with this ID is not found');
      }
      if (card.owner.toString() !== req.user?._id) {
        next((new ForbiddenError('Attempt to delete other user\'s card')));
      }
      res.status(SUCCESSFUL_REQUEST_STATUS).send({ message: 'Card is deleted' });
      return;
    })
    .catch((err) => next(err));
};

export const likeCard = (req: TypeUser, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user?._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: card });
        return;
      }
      next((new NotFoundError('Card with this ID is not found')));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next((new ValidationError('Like data is incorrect')))
      }
      next(err);
    });
};

export const dislikeCard = (req: TypeUser, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user?._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: card });
        return;
      }
      next((new NotFoundError('Card with this ID is not found')))
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next((new ValidationError('Dislike data is incorrect')));
      }
      next(err);
    });
};
