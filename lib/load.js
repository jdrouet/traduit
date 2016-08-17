const {readFile} = require('fs');

const loadFile = function(file) {
  return new Promise(function(resolve, reject) {
    readFile(file, function(err, res) {
      if (err) return reject(err);
      try {
        return resolve(JSON.parse(res));
      } catch(err) {
        return reject(err);
      }
    });
  });
};

module.exports = loadFile;
