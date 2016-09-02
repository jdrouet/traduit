const {readJsonSync, writeFileSync} = require('fs-extra');
const {basename} = require('path');
const _ = require('lodash');
const flatten = require('flat');
const unflatten = flatten.unflatten;
const inquirer = require('inquirer');

const debug = require('debug')('traduit:file');

class File {

  constructor(filepath) {
    debug('contructor', filepath);
    this.filename = basename(filepath);
    this.filepath = filepath;
    this.content = null;
  }

  append(key) {
    debug('append', key);
    return inquirer.prompt({
      name: 'value',
      message: `What is the value for ${this.filename} ?`,
      type: 'input'
    }).then(res => {
      this.put(key, res.value);
      return this;
    });
  }

  hasKey(key) {
    return this.content && !!this.content[key];
  }

  keys() {
    return _.keys(this.content);
  }

  load() {
    debug('load');
    try {
      this.content = flatten(readJsonSync(this.filepath));
      return Promise.resolve(this);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  save() {
    debug('save');
    try {
      writeFileSync(this.filepath, JSON.stringify(unflatten(this.content), null, 2));
      return Promise.resolve(this);
    } catch (err) {
      return Promise.reject(err);
    }
  }

  put(key, value) {
    debug('put', key, value);
    this.content[key] = value;
  }

  drop(key) {
    debug('drop', key);
    delete this.content[key];
  }

}

module.exports = File;
