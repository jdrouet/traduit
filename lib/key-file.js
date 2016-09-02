const inquirer = require('inquirer');

const loop = require('./promise-loop');

class KeyFile {

  constructor(key, present, absent) {
    this.key = key;
    this.present = present;
    this.absent = absent;
  }
  
  run() {
    return inquirer.prompt({
      name: 'action',
      message: `Should I delete ${this.key} ?`,
      type: 'confirm'
    }).then(res => {
      if (res.action) {
        return this.delete();
      } else {
        return this.append();
      }
    })
  }

  delete() {
    this.present.forEach(file => file.drop(this.key));
    return Promise.resolve(this);
  }

  append() {
    return loop(this.absent, file => file.append(this.key));
  }

};

module.exports = KeyFile;
