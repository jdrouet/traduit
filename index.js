#!/usr/bin/env node

const commander = require('commander');
const run = require('./lib');

commander
  .version('1.0.0')
  .usage('[options] <file ...>')
  .option('-d, --delete', 'Delete the entry key from the files')
  .parse(process.argv);

const options = {
  delete: commander.delete,
  sync: commander.sync,
  files: commander.args
};

run(options)
  .catch(err => console.error(err));
