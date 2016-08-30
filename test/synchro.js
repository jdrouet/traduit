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

describe('Synchronize translations', function() {

  let inquirerMock;

  beforeEach(() => {
    return fs.writeJsonSync(files[0], {
      key1: {
        key2: 'value key1.key2'
      }
    });
  });

  beforeEach(() => {
    return fs.writeJsonSync(files[1], {
      key3: {
        key4: 'value key3.key4'
      }
    });
  });

  beforeEach(() => {
    inquirerMock = sinon.mock(inquirer);
  });

  afterEach(() => {
    inquirerMock.restore();
  });

  it('should run the script', function(done) {
    const options = {sync: true, files};
    inquirerMock
      .expects('prompt')
      .once()
      .returns(Promise.resolve([
        {
          key: `${files[1]}:key1.key2`,
          value: 'value key1.key2',
        },
        {
          key: `${files[0]}:key3.key4`,
          value: 'value key3.key4',
        }
      ]));
    script(options)
      .then(() => {
        inquirerMock.verify();
        files.map(item => {
          const content = fs.readJsonSync(item);
          expect(content.key1.key2).to.equal('value key1.key2');
          expect(content.key3.key4).to.equal('value key3.key4');
        });
        done();
      }).catch(done);
  });

});
