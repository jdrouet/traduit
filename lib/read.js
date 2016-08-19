const {readJsonSync} = require('fs-extra');

const loadFile = function(file) {
  try {
    return Promise.resolve(readJsonSync(file));
  } catch(err) {
    return Promise.reject(err);
  }
};

module.exports = loadFile;
