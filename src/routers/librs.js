// import express from 'express';
// const app = express();
// краще так:
import { Router } from 'express';
const librRouter = Router(); //ф-ція Router() створює об'єкт librRouter де зберігатимуться маршрути .get

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  addLibrController,
  deleteLibrController,
  getLibrsBiIdController,
  getLibrsController,
  patchLibrController,
  upsertLibrController,
} from '../controllers/librs.js';

import { isValidId } from '../middlewares/isValidId.js';

import { validateBody } from '../utils/validateBody.js';

import { librAddSchema, librUpdateSchema } from '../validation/librs.js';

librRouter.get('/', ctrlWrapper(getLibrsController));

librRouter.get('/:id', isValidId, ctrlWrapper(getLibrsBiIdController));

librRouter.post(
  '/',
  validateBody(librAddSchema),
  ctrlWrapper(addLibrController),
);

librRouter.put(
  '/:id',
  isValidId,
  validateBody(librAddSchema),
  ctrlWrapper(upsertLibrController),
);

librRouter.patch(
  '/:id',
  isValidId,
  validateBody(librUpdateSchema),
  ctrlWrapper(patchLibrController),
);

librRouter.delete('/:id', isValidId, ctrlWrapper(deleteLibrController));

export default librRouter;
