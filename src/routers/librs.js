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

librRouter.get('/', ctrlWrapper(getLibrsController));

librRouter.get('/:id', ctrlWrapper(getLibrsBiIdController));

librRouter.post('/', ctrlWrapper(addLibrController));

librRouter.put('/:id', ctrlWrapper(upsertLibrController));

librRouter.patch('/:id', ctrlWrapper(patchLibrController));

librRouter.delete('/:id', ctrlWrapper(deleteLibrController));

export default librRouter;
