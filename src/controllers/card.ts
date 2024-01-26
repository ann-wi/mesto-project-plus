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

  Card.create({ name, link, owner: req.user?._id })
    .then((card) => res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: card, message: 'A new card was created' }))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next((new ValidationError('New card data is incorrect')));
      } else {
        next(err);
      }
    });
};

export const deleteCardById = async (req: TypeUser, res: Response, next: NextFunction) => {
  try {
    const { cardID } = req.params;
    const cardToDelete = await Card.findById(cardID).orFail();
    if (cardToDelete.owner.toString() !== req.user?._id) {
      throw new ForbiddenError('Attempt to delete other user\'s card');
    }
    const deletedCard = await cardToDelete.deleteOne();
    return res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: deletedCard, message: 'Card is deleted' });
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      next((new ValidationError('Invalid ID format')));
    } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
      next((new NotFoundError('Card is not found')));
    } else {
      next(err);
    }
  }
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
      if (err instanceof mongoose.Error.CastError) {
        next((new ValidationError('Invalid ID format')));
      } else {
        next(err);
      }
    });
};

export const dislikeCard = (req: TypeUser, res: Response, next: NextFunction) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user?._id } }, { new: true })
    .then((card) => {
      if (card) {
        res.status(SUCCESSFUL_REQUEST_STATUS).send({ data: card });
        return;
      }
      next((new NotFoundError('Card with this ID is not found')));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next((new ValidationError('Invalid ID format')));
      } else {
        next(err);
      }
    });
};
