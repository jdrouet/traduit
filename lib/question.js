const path = require('path');
const {omit} = require('lodash');
const inquirer = require('inquirer');

module.exports = function(files) {
  const questions = files.map(function(filename) {
    return {
      type: 'input',
      name: filename,
      message: `What is the value for ${path.basename(filename)} ?`,
    };
  });
  return inquirer.prompt([
    {
      type: 'input',
      name: 'key',
      message: 'What is the key ?',
    }, ...questions
  ]).then(function(result) {
    return {
      key: result.key,
      values: omit(result, ['key']),
    }
  });
};

