const path = require('path');
const flatten = require('flat');
const _ = require('lodash');
const inquirer = require('inquirer');

const readFile = require('./read');

const fileQuestions = function(options) {
  return options.files.map(function(filename) {
    return {
      type: 'input',
      name: filename,
      message: `What is the value for ${path.basename(filename)} ?`,
    };
  });
};

const keyQuestion = function(options) {
  if (options.delete) {
    return Promise.all(options.files.map(readFile))
      .then(result => {
        return _(result)
          .map(item => _.keys(flatten(item)))
          .flatten()
          .sortedUniq()
          .value();
      })
      .then(result => {
        return {
          message: 'What is the key ?',
          name: 'key',
          type: 'list',
          choices: result
        };
      })
  } else {
    return Promise.resolve({
      type: 'input',
      name: 'key',
      message: 'What is the key ?',
    });
  }
};

const getQuestions = function(options) {
  if (options.delete) {
    return keyQuestion(options);
  } else {
    return Promise.all([
      keyQuestion(options),
      fileQuestions(options),
    ]);
  }
};

module.exports = function(options) {
  return getQuestions(options)
    .then(questions => {
      return inquirer.prompt(questions);
    })
    .then(function(result) {
      return {
        key: result.key,
        values: _.omit(result, ['key']),
      }
    });
};

