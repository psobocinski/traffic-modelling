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

  describe('calculateAverageResult', () => {
    it('returns a row containing the average of all table rows', () => {
      const results = [
          [1, 2],
          [3, 4]
        ],
        avg = utils.calculateAverageResult(results);

      expect(avg).toEqual([2, 3]);
    });

    it('rounds to two decimal points', () => {
      const results = [
          [1.11],
          [2]
        ],
        avg = utils.calculateAverageResult(results);

      expect(avg).toEqual([1.56]);
    });

    it('ignores non-numeric values', () => {
      const results = [
          [null, undefined, 5, 'x', {}],
          ['--', '--', 10, '--', '--']
        ],
        avg = utils.calculateAverageResult(results);

      expect(avg).toEqual(
        [undefined, undefined, 7.5, undefined, undefined]
      );
    });
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
