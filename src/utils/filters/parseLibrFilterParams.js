import { typeList } from '../../constants/librs.js';

const parseNumber = (value) => {
  if (typeof value !== 'string') return;

  const parsedNumber = parseInt(value);
  if (Number.isNaN(parsedNumber)) return;

  return parsedNumber;
};

export const parseLibrFilterParams = ({
  minTotalPage,
  maxTotalPage,
  genre,
}) => {
  const parsedMinTotalPage = parseNumber(minTotalPage);
  const parsedMaxTotalPage = parseNumber(maxTotalPage);

  const parsedGenre = typeList.includes(genre) ? genre : undefined;
  //   console.log(parsedGenre);

  return {
    minTotalPage: parsedMinTotalPage,
    maxTotalPage: parsedMaxTotalPage,
    genre: parsedGenre,
  };
};
