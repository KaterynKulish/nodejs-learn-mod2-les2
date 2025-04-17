const parseNumber = (value, defaultValue) => {
  if (typeof value !== 'string') return defaultValue; //перевіряє, чи є передане значення рядком. Якщо це не так, повертає defaultValue

  const parsedValue = parseInt(value);
  if (Number.isNaN(parsedValue)) return defaultValue; //Якщо  значення є рядком, спробує перетворити його на число. Якщо результат перетворення є NaN (не число), повертається defaultValue

  return parsedValue;
};

export const parsePagenationParams = ({ page, perPage }) => {
  const parsedPage = parseNumber(page, 1);
  const parsedPerPage = parseNumber(perPage, 10);

  return {
    page: parsedPage,
    perPage: parsedPerPage,
  };
};
