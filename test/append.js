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

describe('Append translation', function() {

  let inquirerMock;

  beforeEach(() => {
    return files.map(filename => {
      return fs.writeJsonSync(filename, {});
    });
  });

  beforeEach(() => {
    inquirerMock = sinon.mock(inquirer);
  });

  afterEach(() => {
    inquirerMock.restore();
  });

  it('should run the script', function(done) {
    const options = {files};
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
          const content = fs.readJsonSync(item);
          expect(content.key1.key2).to.equal('value:' + item);
        });
        done();
      }).catch(done);
  });

});
