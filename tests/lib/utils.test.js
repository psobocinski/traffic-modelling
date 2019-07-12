const utils = require('../../lib//utils');

describe('utils', () => {
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

  describe('indexOfShortestLane', () => {
    let lanes, c;

    it('returns the index of shortest lane', () => {
      lanes = [ [c], [] ];

      index = utils.indexOfShortestLane(lanes);

      expect(index).toEqual(1);
    });

    it('returns the lowest index when lanes have same length', () => {
      lanes = [ [c, c], [c, c] ];

      index = utils.indexOfShortestLane(lanes);

      expect(index).toEqual(0);
    });
  });
});
