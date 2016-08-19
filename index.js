#!/usr/bin/env node

const question = require('./lib/question');
const processFile = require('./lib/process');
const _ = require('lodash');

question(process.argv.slice(2))
  .then(function(res) {
    return Promise.all(_.map(res.values, function(value, key) {
      console.log(key, res.key, value);
      return processFile(key, res.key, value);
    }));
  })
  .catch(err => console.error(err));
