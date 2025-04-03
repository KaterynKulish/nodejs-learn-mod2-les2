// import express from 'express';
// const app = express();
// краще так:
import { Router } from 'express';
const librRouter = Router(); //ф-ція Router() створює об'єкт librRouter де зберігатимуться маршрути .get

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import {
  getLibrsBiIdController,
  getLibrsController,
} from '../controllers/librs.js';

librRouter.get('/', ctrlWrapper(getLibrsController));

librRouter.get('/:id', ctrlWrapper(getLibrsBiIdController));

export default librRouter;
