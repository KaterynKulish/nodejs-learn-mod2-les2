import LibrCollection from '../db/models/Libr.js';

export const getLibrs = () => LibrCollection.find();

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
