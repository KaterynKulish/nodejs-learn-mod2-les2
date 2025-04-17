import LibrCollection from '../db/models/Libr.js';

import { sortList } from '../constants/index.js';

import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getLibrs = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = sortList[0],
  filters = {},
}) => {
  const skip = (page - 1) * perPage; // для наступних сторінок - скільки документів пропустити з початку колекції

  const librQuery = LibrCollection.find(); //для фільтрації методом Query Builder. Без await повернеться об'єкт запиту

  if (filters.genre) {
    librQuery.where('genre').equals(filters.genre);
  }
  if (filters.minTotalPage) {
    librQuery.where('total_page').gte(filters.minTotalPage);
  }
  if (filters.maxTotalPage) {
    librQuery.where('total_page').lte(filters.maxTotalPage);
  }

  // const items = await LibrCollection.find()
  const items = await librQuery
    .skip(skip)
    .limit(perPage)
    .sort({ [sortBy]: sortOrder });

  // const totalItems = await LibrCollection.find()
  const totalItems = await LibrCollection.find()
    .merge(librQuery)
    .countDocuments();

  const paginationData = calcPaginationData({ page, perPage, totalItems });

  return { items, page, perPage, totalItems, ...paginationData };
};

export const getLibrById = (id) => {
  //   throw new Error('Database crashed'); // для імітації не працюючого бекенду
  return LibrCollection.findOne({ _id: id });
};

// для POST-запиту
export const addLibr = (payload) => LibrCollection.create(payload);

// для PUT, PATCH-запитів
export const updateLibr = async (_id, payload, option = {}) => {
  const { upsert = false } = option;
  const rawResult = await LibrCollection.findOneAndUpdate({ _id }, payload, {
    // винесли new: true i runValidators: true в хук
    /*    new: true, // для виправлення глюку в Постмані (не виводяться зміни)
    runValidators: true, // щоб при оновленні викликав валідацію по схемі Schema */

    upsert, // щоб запит не тільки оновлював, і додавав
    includeResultMetadata: true,
  });
  // return rawResult;

  if (!rawResult || !rawResult.value) return null;
  return {
    data: rawResult.value,
    isNew: Boolean(rawResult.lastErrorObject.upserted),
  };
};

export const deleteLibrById = (_id) => LibrCollection.findOneAndDelete({ _id });
