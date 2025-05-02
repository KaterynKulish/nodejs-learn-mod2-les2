import createHttpError from 'http-errors';

import {
  addLibr,
  deleteLibrById,
  getLibrById,
  getLibrs,
  updateLibr,
} from '../servises/librs.js';

// import { librAddSchema } from '../validation/librs.js';

import { parsePagenationParams } from '../utils/parsePagenationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { librSortFields } from '../db/models/Libr.js';
import { parseLibrFilterParams } from '../utils/filters/parseLibrFilterParams.js';
import { saveFileToLocal } from '../utils/saveFileToLocal.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import { saveFile } from '../utils/saveFile.js';

export const getLibrsController = async (req, res) => {
  // console.log(req.query); // тут параметри запиту від фронтенту для пагінації
  const paginationParams = parsePagenationParams(req.query);
  // console.log(paginationParams);

  const sortParams = parseSortParams(req.query, librSortFields);

  const filters = parseLibrFilterParams(req.query);
  // console.log(filters);

  // const { _id: userId } = req.user; //тянемо userId з authenticate
  // filters.userId = userId; //додаємо юзера до фільтрації
  filters.userId = req.user._id; //додаємо юзера до фільтрів - простіший варіант

  const data = await getLibrs({ ...paginationParams, ...sortParams, filters });
  res.json({
    status: 200,
    message: 'Successfully find libr',
    data,
  });
};

// тут після створення декоратора прибрала try/catch/next :
// export const getLibrsController = async (req, res) => {
//   const data = await getLibrs();
//   res.json({
//     status: 200,
//     message: 'Successfully find libr',
//     data,
//   });
// };

// тут після створення декоратора залишила try/catch/next:
export const getLibrsBiIdController = async (req, res, next) => {
  try {
    console.log(req.params); //тут повертається те, що після : в адресі запиту(динамічний параметр)
    const { id } = req.params;

    const data = await getLibrById(id);

    if (!data) {
      throw createHttpError(404, `Libr with id=${id} not found`);

      //   const error = new Error(`Libr with id=${id} not found`);
      //   error.status = 404;
      //     throw error;

      //   return res.status(404).json({
      //     status: 404,
      //     message: `Libr with id=${id} not found`,
      //   });
    }

    res.json({
      status: 200,
      message: `Successfully find libr with id=${id}`,
      data,
    });
  } catch (error) {
    next(error);

    // const { status = 500, message = 'Server error' } = error;
    // res.status(status).json({
    //   message,
    // });

    // res.status(500).json({
    //   message: error.message,
    // });
  }
};

export const addLibrController = async (req, res) => {
  //   const validateResult = librAddSchema.validate(req.body);
  //   console.log(validateResult); //це об'єкт,що додається до БД

  /*  const { error } = librAddSchema.validate(req.body, { abortEarly: false });
  if (error) {
    throw createHttpError(400, error.message);
  }*/

  /* try {
    await librAddSchema.validateAsync(req.body, {
      abortEarly: false,
    });
  } catch (error) {
    throw createHttpError(400, error.message);
  } */

  // console.log(req.body);

  const { _id: userId } = req.user; //беремо _id з об'єкта user, записуємо його в userId

  const data = await addLibr({ ...req.body, userId });

  res.status(201).json({
    status: 201,
    message: 'Successfully add movie',
    data,
  });
};

export const upsertLibrController = async (req, res) => {
  const { id } = req.params;
  const { data, isNew } = await updateLibr(id, req.body, { upsert: true });
  const status = isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: 'Successfully updade',
    data,
  });
};

export const patchLibrController = async (req, res) => {
  const { id } = req.params;

  let posterUrl = null;
  if (req.file) {
    // posterUrl = await saveFileToLocal(req.file); //для збереження локально
    // posterUrl = await saveFileToCloudinary(req.file); //для збереження в хмарі
    posterUrl = await saveFile(req.file); //для збереження по вибору - strategy
  }

  const result = await updateLibr(id, { ...req.body, posterUrl });

  if (!result) {
    throw createHttpError(404, `Libr with id=${id} not found`);
  }

  res.json({
    status: 200,
    message: 'Successfully updade libr',
    data: result.data,
  });
};

export const deleteLibrController = async (req, res) => {
  const { id } = req.params;
  const data = await deleteLibrById(id);

  if (!data) {
    throw createHttpError(404, `Libr with id=${id} not found`);
  }

  res.status(204).send();
};
