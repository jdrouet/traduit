const readFile = require('./read');
const writeFile = require('./write');
const flatten = require('flat');
const unflatten = flatten.unflatten;
const {merge} = require('lodash');

const processAdd = function(translations, key, value) {
  return unflatten(merge(flatten(translations), {
    [key]: value
  }));
};

const processRm = function(translations, key) {
  let flat = flatten(translations);
  if (flat[key]) {
    delete flat[key];
  }
  return unflatten(flat);
};

const processFile = function(filename, key, value, options) {
  return readFile(filename)
    .then(translations => {
      if (options.delete) {
        return processRm(translations, key);
      } else {
        return processAdd(translations, key, value);
      }
    })
    .then(translations => {
      return writeFile(filename, translations);
    })
};

module.exports = processFile;
