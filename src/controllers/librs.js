import createHttpError from 'http-errors';

import {
  addLibr,
  deleteLibrById,
  getLibrById,
  getLibrs,
  updateLibr,
} from '../servises/librs.js';

export const getLibrsController = async (req, res) => {
  try {
    const data = await getLibrs();
    res.json({
      status: 200,
      message: 'Successfully find libr',
      data,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
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
  console.log(req.body);

  const data = await addLibr(req.body);

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
  const result = await updateLibr(id, req.body);

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
