/* global describe context it */
const { expect } = require('chai');
const {
  detectEncoding,
  nullIfEmpty,
  toPlainOrEmptyObject,
} = require('../../src/utils');

describe('utils', () => {
  describe('#toPlainOrEmptyObject', () => {
    context('with a plain object', () => {
      it('should return the plain object', () => {
        const plainObject = { name: 'Leonardo' };
        expect(toPlainOrEmptyObject(plainObject)).to.eq(plainObject);
      });
    });

    context('with a non plain object', () => {
      it('should return an empty object', () => {
        const nonPlainObject = [];
        expect(toPlainOrEmptyObject(nonPlainObject)).to.eql({});
      });
    });
  });

  describe('#nullIfEmpty', () => {
    context('with a non empty object', () => {
      it('should return the non empty object', () => {
        const nonEmptyObject = { name: 'Leonardo' };
        expect(nullIfEmpty(nonEmptyObject)).to.eq(nonEmptyObject);
      });
    });

    context('with an empty object', () => {
      it('should return null', () => {
        expect(nullIfEmpty({})).to.be.null;
      });
    });
  });

  describe('#detectEncoding', () => {
    context('with application/json content-type', () => {
      it('should return utf8', () => {
        const request = {
          headers: {
            'content-type': 'application/json',
          },
        };
        expect(detectEncoding(request)).to.eq('utf8');
      });
    });

    context('with multipart/form-data content-type', () => {
      it('should return binary', () => {
        const request = {
          headers: {
            'content-type': 'multipart/form-data',
          },
        };
        expect(detectEncoding(request)).to.eq('binary');
      });
    });
  });
});
