const {merge, omit} = require('lodash');
const processFile = require('./process');
const readFiles = require('./read');
const writeFiles = require('./write');

module.exports = function(options) {
  return readFiles(options.files)
    .then(files => processFile(merge(omit(options, 'files'), {files})))
    .then(files => writeFiles(files));
};
