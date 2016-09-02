const sinon = require('sinon');
const path = require('path');
const {expect} = require('chai');
const fs = require('fs-extra');
const inquirer = require('inquirer');

const File = require('../lib/file');
const KeyFile = require('../lib/key-file');

describe('KeyFile', function() {

  describe('constructor', () => {

    it('should get the key and the files', () => {
      let fileEn = new File(path.join(__dirname, 'resources/locale-en.json'));
      let fileFr = new File(path.join(__dirname, 'resources/locale-fr.json'));
      fileEn.content = {'toto.tata': 'yolo'};
      fileFr.content = {};
      let keyFile = new KeyFile('toto.tata', [fileEn], [fileFr]);
      expect(keyFile.key).to.equal('toto.tata');
      expect(keyFile.present).to.have.members([fileEn]);
      expect(keyFile.absent).to.have.members([fileFr]);
    });

  });

  describe('delete', () => {

    it('should delete the key to the present files', (done) => {
      let fileEn = new File(path.join(__dirname, 'resources/locale-en.json'));
      let fileFr = new File(path.join(__dirname, 'resources/locale-fr.json'));
      fileEn.content = {'toto.tata': 'yolo'};
      fileFr.content = {};
      let keyFile = new KeyFile('toto.tata', [fileEn], [fileFr]);
      keyFile.delete()
        .then(res => {
          expect(fileEn.content).to.not.have.property('toto.tata');
          done();
        });
    });

  });

  describe('run', () => {

    let inquirerMock;

    beforeEach(() => {
      inquirerMock = sinon.mock(inquirer);
    });

    afterEach(() => inquirerMock.restore());

    it('should run the append command', (done) => {
      let keyFile = new KeyFile('toto.tata', [], []);
      let appendMock = sinon.mock(keyFile);
      appendMock.expects('append').once().returns(true);
      inquirerMock.expects('prompt').once().returns(Promise.resolve({action: false}));
      keyFile.run()
        .then(res => {
          appendMock.verify();
          done();
        })
        .catch(done);
    });

    it('should run the delete command', (done) => {
      let keyFile = new KeyFile('toto.tata', [], []);
      let appendMock = sinon.mock(keyFile);
      appendMock.expects('delete').once().returns(true);
      inquirerMock.expects('prompt').once().returns(Promise.resolve({action: true}));
      keyFile.run()
        .then(res => {
          appendMock.verify();
          done();
        })
        .catch(done);
    });

  });

  describe('append', () => {

    let inquirerMock;

    beforeEach(() => {
      inquirerMock = sinon.mock(inquirer);
    });

    afterEach(() => inquirerMock.restore());

    it('should append the key to the absent files', (done) => {
      let fileEn = new File(path.join(__dirname, 'resources/locale-en.json'));
      let fileEs = new File(path.join(__dirname, 'resources/locale-es.json'));
      let fileFr = new File(path.join(__dirname, 'resources/locale-fr.json'));
      fileEn.content = {'toto.tata': 'yolo'};
      fileEs.content = {'toto.tata': 'yolo'};
      fileFr.content = {};
      let keyFile = new KeyFile('toto.tata', [fileEn], [fileFr, fileEs]);
      inquirerMock.expects('prompt').once().returns(Promise.resolve({value: 'french yolo'}));
      inquirerMock.expects('prompt').once().returns(Promise.resolve({value: 'spanish yolo'}));
      keyFile.append()
        .then(res => {
          expect(fileEn.content).to.have.property('toto.tata').and.equal('yolo');
          expect(fileFr.content).to.have.property('toto.tata').and.equal('french yolo');
          expect(fileEs.content).to.have.property('toto.tata').and.equal('spanish yolo');
          done();
        })
        .catch(done);
    });

  });

});
