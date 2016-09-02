const sinon = require('sinon');

const path = require('path');
const {expect} = require('chai');
const fs = require('fs-extra');
const inquirer = require('inquirer');

const Processor = require('../lib/processor');

const files = [
  {src: path.join(__dirname, 'resources/locale-en.json'), content: {toto: {tutu: 'toto'}}, lang: 'en'},
  {src: path.join(__dirname, 'resources/locale-es.json'), content: {toto: {tutu: 'toto'}}, lang: 'es'},
  {src: path.join(__dirname, 'resources/locale-fr.json'), content: {toto: {tutu: 'toto'}, other: 'empty'}, lang: 'fr'},
];

describe('Processor', function() {

  beforeEach(() => files.map(file => fs.writeJsonSync(file.src, file.content)));

  describe('constructor', () => {

    it('should create files', () => {
      let processor = new Processor(files.map(item => item.src), {});
      expect(processor.files).to.have.length(3);
      processor.files.forEach(file => {
        expect(file).to.be.an('Object');
      });
    });

  });

  describe('load', () => {

    it('should load all the files', (done) => {
      let processor = new Processor(files.map(item => item.src), {});
      processor.load()
        .then(() => {
          processor.files.forEach(file => {
            expect(file.content).to.be.an('object');
          });
          done();
        });
    });

  });

  describe('keys', () => {

    it('should load all the files', (done) => {
      let processor = new Processor(files.map(item => item.src), {});
      processor.load()
        .then(() => {
          expect(processor.keys()).to.have.members(['toto.tutu', 'other'])
          done();
        }).catch(done);
    });

  });

  describe('append', () => {

    let inquirerMock;

    beforeEach(() => {
      inquirerMock = sinon.mock(inquirer);
    });

    afterEach(() => inquirerMock.restore());

    it('should ask for a key and call append on files', (done) => {
      let processor = new Processor(files.map(item => item.src), {});
      let mocks = processor.files.map(item => sinon.mock(item));
      mocks.forEach(mock => mock.expects('append').once().returns(Promise.resolve(true)));
      inquirerMock.expects('prompt').once().returns(Promise.resolve({key: 'another.key'}));
      processor.append()
        .then(() => {
          mocks.forEach(mock => mock.verify());
          inquirerMock.verify();
          done();
        });
    });

  });

  describe('delete', () => {

    let inquirerMock;

    beforeEach(() => {
      inquirerMock = sinon.mock(inquirer);
    });

    afterEach(() => inquirerMock.restore());

    it('should ask for a key and call append on files', (done) => {
      let processor = new Processor(files.map(item => item.src), {});
      let mocks = processor.files.map(item => sinon.mock(item));
      mocks.forEach(mock => mock.expects('drop').once().returns(true));
      inquirerMock.expects('prompt').once().returns(Promise.resolve({key: 'a.key'}));
      processor.delete()
        .then(() => {
          mocks.forEach(mock => mock.verify());
          inquirerMock.verify();
          done();
        });
    });

  });

  describe('sync', () => {

    let inquirerMock;

    beforeEach(() => {
      inquirerMock = sinon.mock(inquirer);
    });

    afterEach(() => inquirerMock.restore());

    it('should ask for a key and call append on files', (done) => {
      let processor = new Processor(files.map(item => item.src), {});
      inquirerMock.expects('prompt').once().returns(Promise.resolve({action: true}));
      processor.load()
        .then(() => processor.sync())
        .then(() => {
          inquirerMock.verify();
          done();
        });
    });

  });

  describe('run', () => {

    it('should call delete', (done) => {
      let processor = new Processor(files.map(item => item.src), {delete: true});
      let mock = sinon.mock(processor);
      mock.expects('delete').once().returns(processor);
      processor.run()
        .then(() => {
          done();
        });
    });

    it('should call sync', (done) => {
      let processor = new Processor(files.map(item => item.src), {sync: true});
      let mock = sinon.mock(processor);
      mock.expects('sync').once().returns(processor);
      processor.run()
        .then(() => {
          done();
        });
    });

    it('should call append', (done) => {
      let processor = new Processor(files.map(item => item.src), {});
      let mock = sinon.mock(processor);
      mock.expects('append').once().returns(processor);
      processor.run()
        .then(() => {
          done();
        });
    });

  });

});
