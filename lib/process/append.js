const {merge, reduce} = require('lodash');
const {basename} = require('path');
const inquirer = require('inquirer');

const question = function(options) {
  return Promise.resolve(reduce(options.files, (res, content, filename) => {
    return {
      type: 'input',
      name: filename,
      message: `What is the value for ${basename(filename)} ?`,
    };
  }, [
    {
      type: 'input',
      name: 'key',
      message: 'What is the key ?',
    }
  ])).then(questions => inquirer.prompt(questions));
};

const append = function(result, options) {
  return reduce(options.files, (res, content, filename) => {
    if (result[filename]) {
      res[filename] = merge({}, content, {[result.key]: result[filename]});
    } else {
      res[filename] = content;
    }
    return res;
  }, {});
};

module.exports = function(options) {
  return question(options)
    .then(answers => append(answers, options));
};
