const _ = require('lodash');
const {basename} = require('path');
const inquirer = require('inquirer');

const question = function(options) {
  return Promise.resolve({
    message: 'What is the key ?',
    name: 'key',
    type: 'list',
    choices: _(options.files)
      .map(item => _.keys(item))
      .flatten()
      .sortedUniq()
      .value()
  }).then(questions => inquirer.prompt(questions));
};

const remove = function(result, options) {
  return _.reduce(options.files, (res, content, filename) => {
    res[filename] = _.omit(content, result.key);
    return res;
  }, {});
};

module.exports = function(options) {
  return question(options)
    .then(answers => remove(answers, options));
};
