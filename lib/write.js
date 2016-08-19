const {writeFileSync} = require('fs-extra');

const writeFile = function(file, content) {
  try {
    const json = JSON.stringify(content, null, 2);
    return Promise.resolve(writeFileSync(file, json));
  } catch(err) {
    return Promise.reject(err);
  }
};

module.exports = writeFile;
