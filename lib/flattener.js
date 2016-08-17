const {isObject, merge, reduce} = require('lodash');

const flattener = function(input, suffix = []) {
  return reduce(input, function(output, value, key) {
    if (isObject(value)) {
      return merge({}, output, flattener(value, [...suffix, key]));
    } else {
      let joined = [...suffix, key].join('.');
      return merge({}, output, {
        [joined]: value
      });
    }
  }, {});
};

module.exports = flattener;
