'use strict';

const LaneAssigner = require('../../../lib/traffic-model/LaneAssigner');

describe('LaneAssigner', () => {
  describe('indexOfShortestLane', () => {
    let lanes, index, c;

    it('returns the index of shortest lane', () => {
      lanes = [ [c], [] ];

      index = LaneAssigner.indexOfShortestLane(lanes);

      expect(index).toEqual(1);
    });

    it('returns the lowest index when lanes have same length', () => {
      lanes = [ [c, c], [c, c] ];

      index = LaneAssigner.indexOfShortestLane(lanes);

      expect(index).toEqual(0);
    });
  });
});
