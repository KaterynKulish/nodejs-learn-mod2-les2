import Joi from 'joi';

import { typeList } from '../constants/librs.js';

export const librAddSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'Треба вказати назву книги',
    'string.base': 'Назва книги має бути строкою',
  }),
  total_page: Joi.number().required(),
  genre: Joi.string().valid(...typeList),
});

// Валідотор для PATCH-запиту:
export const librUpdateSchema = Joi.object({
  title: Joi.string(),
  total_page: Joi.number(),
  genre: Joi.string().valid(...typeList),
});
