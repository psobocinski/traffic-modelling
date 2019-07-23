'use strict';

const utils = require('../../lib//utils');

describe('utils', () => {
  describe('arrayDifference', () => {
    it('returns the difference of two arrays', () => {
      const a = [1, 2, 3],
        b = [3, 2],
        difference = utils.arrayDifference(a, b);

      expect(difference).toEqual([1]);
    })
  });

  describe('isSet', () => {
    describe('true for', () => {
      it('0', () => expect(utils.isSet(0)).toBe(true));
      it("empty string", () => expect(utils.isSet('')).toBe(true));
      it("empty object", () => expect(utils.isSet({})).toBe(true));
    });

    describe('false for', () => {
      it('null', () => expect(utils.isSet(null)).toBe(false));
      it('undefined', () => expect(utils.isSet(undefined)).toBe(false));
    });
  });

  describe('newArray2D', () => {
    let newArray;

    it('creates an empty 2D array of given length', () => {
      newArray = utils.newArray2D(2);

      expect(newArray).toEqual([[], []]);
    });

    // test to ensure (new Array(arrayLength)).fill([]) is not used (as it creates empty arrays by reference)
    it('creates empty arrays by value (i.e. distinct copies)', () => {
      newArray = utils.newArray2D(2);

      newArray[1].push('x');

      expect(newArray).toEqual([[], ['x']]);
    });
  });
});
