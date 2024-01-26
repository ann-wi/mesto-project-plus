import { celebrate, Joi } from 'celebrate';
import { urlRegex } from '../config';

export const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      'string.empty': 'Field "Email" must be filled',
      'string.email': 'Incorrect email',
    }),
    password: Joi.string().required().messages({
      'string.empty': 'Field "Password" must be filled',
    }),
  }),
});

export const createUserValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Minimum lenght for field "Name" is 2 symbols',
        'string.max': 'Maximum lenght for field "Name" is 30 symbols',
      }),
    about: Joi.string().min(2).max(200)
      .messages({
        'string.min': 'Minimum lenght for field "About" is 2 symbols',
        'string.max': 'Maximum lenght for field "About" is 200 symbols',
      }),
    avatar: Joi.string().pattern(urlRegex).message('Incorrect url'),
    email: Joi.string().required().email()
      .messages({
        'string.empty': 'Field "Email" must be filled',
        'string.email': 'Incorrect email',
      }),
    password: Joi.string().required()
      .messages({
        'string.empty': 'Field "Password" must be filled',
      }),
  }),
});

export const getUserByIdValidation = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().length(24).hex()
      .message('Incorrect id')
      .messages({
        'string.empty': 'Field "ID" must be filled',
      }),
  }),
});

export const updateUserProfileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30)
      .messages({
        'string.min': 'Minimum lenght for field "Name" is 2 symbols',
        'string.max': 'Maximum lenght for field "Name" is 30 symbols',
        'string.empty': 'Field "Name" must be filled',
      }),
    about: Joi.string().required().min(2).max(200)
      .messages({
        'string.min': 'Minimum lenght for field "About" is 2 symbols',
        'string.max': 'Maximum lenght for field "About" is 200 symbols',
        'string.empty': 'Field "About" must be filled',
      }),
  }),
});

export const updateUserAvatarValidation = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegex)
      .message('Incorrect url')
      .messages({
        'string.empty': 'Field "Avatar" must be filled',
      }),
  }),
});
