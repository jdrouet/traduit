const {readJsonSync} = require('fs-extra');
const flatten = require('flat');
const {reduce} = require('lodash');

const loadFiles = function(files) {
  try {
    return Promise.resolve(reduce(files, (res, file) => {
      res[file] = flatten(readJsonSync(file));
      return res;
    }, {}));
  } catch(err) {
    return Promise.reject(err);
  }
};

module.exports = loadFiles;
