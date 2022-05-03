const fs = require('fs/promises');

const createPathIfNotExists = async (path) => {
  try {
    await fs.access(path);
  } catch {
    await fs.mkdir(path);
  }
};

const generateError = (content, status) => {
  const error = new Error(content);
  error.httpStatus = status;
  return error;
};

module.exports = {
  generateError,
  createPathIfNotExists,
};
