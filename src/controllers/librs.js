import createHttpError from 'http-errors';

import { getLibrById, getLibrs } from '../servises/librs.js';

// тут після створення декоратора прибрала try/catch/next :
export const getLibrsController = async (req, res) => {
  const data = await getLibrs();
  res.json({
    status: 200,
    message: 'Successfully find libr',
    data,
  });
};

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
  }
};
