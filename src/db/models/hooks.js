export const handleSaveError = (error, doc, next) => {
  console.log(error);
  error.status = 400;
  next();
};

// хук для new:true i runValidators:true:
export const setUpdateSettings = function (next) {
  this.options.new = true;
  this.options.runValidator = true;
  next();
};
