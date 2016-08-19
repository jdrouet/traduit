const readFile = require('./read');
const writeFile = require('./write');
const flatten = require('flat');
const unflatten = flatten.unflatten;
const {merge} = require('lodash');

const processFile = function(filename, key, value) {
  return readFile(filename)
    .then(translations => {
      return unflatten(merge(flatten(translations), {
        [key]: value
      }));
    })
    .then(translations => {
      return writeFile(filename, translations);
    })
};

module.exports = processFile;
