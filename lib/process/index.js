const append = require('./append');
const remove = require('./delete');

module.exports = function(options) {
  if (options.delete) {
    return remove(options);
  } else {
    return append(options);
  }
};
