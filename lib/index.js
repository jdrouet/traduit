const _ = require('lodash');
const question = require('./question');
const processFile = require('./process');

module.exports = function(options) {
  return question(options)
    .then(function(res) {
      return Promise.all(_.map(res.values, function(value, key) {
        return processFile(key, res.key, value, options);
      }));
    })
};
