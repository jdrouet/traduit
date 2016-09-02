const _ = require('lodash');
const inquirer = require('inquirer');
const File = require('./file');
const KeyFile = require('./key-file');
const loop = require('./promise-loop');

const debug = require('debug')('traduit:processor');

class Processor {

  constructor(files, options) {
    debug('constructor');
    this.files = files.map(path => new File(path));
    this.options = options;
  }

  load() {
    debug('load');
    return Promise.all(this.files.map(file => file.load()));
  }

  save() {
    debug('save');
    return Promise.all(this.files.map(file => file.save()));
  }

  keys() {
    return _.union.apply(_, this.files.map(f => f.keys()));
  }

  append() {
    debug('append');
    return inquirer.prompt({
      name: 'key',
      message: 'What is the key ?',
      type: 'input',
    })
    .then(res => loop(this.files, file => file.append(res.key)));
  }

  delete() {
    debug('delete');
    return inquirer.prompt({
      name: 'key',
      message: 'What is the key ?',
      type: 'list',
      choices: this.keys(),
    })
    .then(res => this.files.forEach(file => file.drop(res.key)));
  }

  sync() {
    debug('sync');
    let keys = this.files.map(file => file.keys());
    let inter = _.intersection.apply(_, keys);
    let diff = _(keys)
      .flatten()
      .filter(item => inter.indexOf(item) < 0)
      .value();
    let keyFiles = diff.map(key => {
      let absent = _.filter(this.files, file => !file.hasKey(key));
      let present = _.filter(this.files, file => file.hasKey(key));
      return new KeyFile(key, present, absent);
    });
    return loop(keyFiles, keyFile => keyFile.run());
  }

  run() {
    debug('run');
    return this.load()
      .then(() => {
        if (this.options.delete) {
          return this.delete();
        } else if (this.options.sync) {
          return this.sync();
        } else {
          return this.append();
        }
      })
      .then(() => this.save());
  }

};

module.exports = Processor;
