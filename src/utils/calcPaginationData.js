export const calcPaginationData = ({ page, perPage, totalItems }) => {
  const totalPages = Math.ceil(totalItems / perPage);
  const hasPrevPage = page > 1; //є попередня сторінка
  const hasNextPage = page < totalPages; //є наступна сторінка

  return {
    totalPages,
    hasNextPage,
    hasPrevPage,
  };
};
