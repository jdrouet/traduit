const sinon = require('sinon');
const path = require('path');
const {expect} = require('chai');
const fs = require('fs-extra');
const inquirer = require('inquirer');

const File = require('../lib/file');

const files = [
  {src: path.join(__dirname, 'resources/locale-en.json'), content: {english: 'toto'}, lang: 'en'},
  {src: path.join(__dirname, 'resources/locale-es.json'), content: {spanish: 'toto'}, lang: 'es'},
  {src: path.join(__dirname, 'resources/locale-fr.json'), content: {french: 'toto'}, lang: 'fr'},
];

describe('File', function() {

  beforeEach(() => files.map(file => fs.writeJsonSync(file.src, file.content)));

  describe('constructor', () => {

    it('should define the filename', () => {
      let file = new File(files[0].src);
      expect(file.filename).to.equal('locale-en.json');
    });

    it('should define the filepath', () => {
      let file = new File(files[0].src);
      expect(file.filepath).to.equal(files[0].src);
    });

  });

  describe('keys', () => {

    let item;

    beforeEach(done => {
      item = new File(files[0].src);
      item.load()
        .then(() => done())
        .catch(done);
    });

    it('should give the existing keys', () => {
      expect(item.keys()).to.have.members(['english']);
    });

  });

  describe('hasKey', () => {

    let item;

    beforeEach(done => {
      item = new File(files[0].src);
      item.load()
        .then(() => done())
        .catch(done);
    });

    it('should check if the key exist', () => {
      expect(item.hasKey('english')).to.be.true;
    });

    it('should check if the key exist', () => {
      expect(item.hasKey('tutu.tata')).to.be.false;
    });

  });

  describe('append', () => {

    let item;
    let inquirerMock;

    beforeEach(done => {
      item = new File(files[0].src);
      item.load()
        .then(() => done())
        .catch(done);
    });

    beforeEach(() => {
      inquirerMock = sinon.mock(inquirer);
    });

    afterEach(() => inquirerMock.restore());

    it('should add the item', (done) => {
      inquirerMock
        .expects('prompt').once()
        .returns(Promise.resolve({value: 'trololo'}));
      item
        .append('tutu.tata')
        .then(() => {
          expect(item.content).to.have.property('tutu.tata');
          done();
        }).catch(done);
    });

  });

  describe('load', () => {

    it(`should fail if no file found`, (done) => {
      let item = new File('/an/empty/file.json');
      item.load()
        .catch(err => {
          expect(err).to.exist;
          done();
        });
    });

    files.forEach(file => {

      it(`should load locale ${file.lang}`, (done) => {
        let item = new File(file.src);
        item.load().then(() => {
          expect(item.content).to.not.equal(null);
          done();
        }).catch(done);
      });

    });

  });

  describe('save', () => {

    files.forEach(file => {

      let item;

      beforeEach(done => {
        item = new File(file.src);
        item.load()
          .then(() => done());
      });

      it(`should save locale ${file.lang}`, (done) => {
        item.put('toto', 'tata');
        item.save().then(() => {
          expect(item.content).to.not.equal(null);
          expect(item.content.toto).to.equal('tata');
          done();
        }).catch(done);
      });

    });

  });

});
