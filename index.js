#!/usr/bin/env node

const commander = require('commander');
const Processor = require('./lib/processor');

commander
  .version('1.0.0')
  .usage('[options] <file ...>')
  .option('-d, --delete', 'Delete the entry key from the files')
  .option('-s, --sync', 'Synchronize every file')
  .parse(process.argv);

let p = new Processor(commander.args, {
  delete: commander.delete,
  sync: commander.sync
}).run()
.then(() => process.exit(0))
.catch(err => {
  console.error(err);
  process.exit(1);
});
