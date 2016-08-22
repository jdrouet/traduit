const fs = require('fs-extra');
const path = require('path');
const script = require('../lib');
const {expect} = require('chai');
const inquirer = require('inquirer');
const sinon = require('sinon');

const files = [
  path.join(__dirname, 'resources/locale-en.json'),
  path.join(__dirname, 'resources/locale-fr.json'),
];

describe('Delete translation', function() {

  let inquirerMock;

  beforeEach(() => {
    return files.map(filename => {
      return fs.writeJsonSync(filename, {key1: {key2: `value:${filename}`}});
    });
  });

  beforeEach(() => {
    inquirerMock = sinon.mock(inquirer);
  });

  afterEach(() => {
    inquirerMock.restore();
  });

  it('should run the script', function(done) {
    const options = {delete: true, files};
    inquirerMock
      .expects('prompt')
      .once()
      .returns(Promise.resolve({
        key: 'key1.key2',
        [files[0]]: 'value:' + files[0],
        [files[1]]: 'value:' + files[1],
      }));
    script(options)
      .then(() => {
        inquirerMock.verify();
        files.map(item => {
          expect(fs.readJsonSync(item)).to.not.have.property('key1');
        });
        done();
      }).catch(done);
  });

});
