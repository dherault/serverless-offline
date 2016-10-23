'use strict';

const chai = require('chai');
const dirtyChai = require('dirty-chai');
const utils = require('../src/utils');

const expect = chai.expect;
chai.use(dirtyChai);


describe('utils', () => {
  describe('#nullIfEmpty', () => {
    describe('with a non empty object', () => {
      it('should return the non empty object', () => {
        const nonEmptyObject = { name: 'Leonardo' };
        expect(utils.nullIfEmpty(nonEmptyObject)).to.eq(nonEmptyObject);
      });
    });

    describe('with an empty object', () => {
      it('should return null', () => {
        expect(utils.nullIfEmpty({})).to.be.null();
      });
    });
  });
});
