export const handleSaveError = (error, doc, next) => {
  console.log(error.code);
  console.log(error.name);
  const { code, name } = error;
  error.status = code === 11000 && name === 'MongoServerError' ? 409 : 400;
  next();

  // console.log(error);
  // error.status = 400;
  // next();
};

// хук для new:true i runValidators:true:
export const setUpdateSettings = function (next) {
  this.options.new = true;
  this.options.runValidator = true;
  next();
};
