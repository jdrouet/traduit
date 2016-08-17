const question = require('./lib/question');
const fs = require('fs-extra');
const _ = require('lodash');

const processFile = function(filename, key, value) {
  return new Promise(function(resolve, reject) {
    fs.readJson(filename, function(err, res) {
      if (err) return reject(err);
      const output = _.merge({[key]: value}, res);
      fs.writeJson(filename, output, function(err) {
        if (err) return reject(err);
        return resolve();
      });
    });
  });
};

question(process.argv.slice(2))
  .then(function(res) {
    return Promise.all(_.map(res.values, function(value, key) {
      return processFile(key, res.key, value);
    }));
  });
