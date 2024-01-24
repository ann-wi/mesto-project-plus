import { celebrate, Joi } from 'celebrate';
import { urlRegex } from '../config';

export const createCardValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Minimum lenght for field "Name" is 2 symbols',
        'string.max': 'Maximum lenght for field "Name" is 30 symbols',
        'string.empty': 'Field "Name" must be filled',
      }),
    link: Joi.string().required().pattern(urlRegex)
      .message('Incorrect url')
      .messages({
        'string.empty': 'Field "Link" must be filled',
      }),
  }),
});

export const getCardByIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex()
      .message('Incorrect id')
      .messages({
        'string.empty': 'Field "ID" must be filled',
      }),
  }),
});