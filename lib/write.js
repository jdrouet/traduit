const {writeFileSync} = require('fs-extra');
const unflatten = require('flat').unflatten;
const {forEach} = require('lodash');

const writeFiles = function(files) {
  try {
    forEach(files, (content, filename) => {
      const json = JSON.stringify(unflatten(content), null, 2);
      return writeFileSync(filename, json);
    });
    return files;
  } catch(err) {
    return Promise.reject(err);
  }
};

module.exports = writeFiles;
