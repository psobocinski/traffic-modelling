'use strict';

const { LaneChangeDecider } = require('../../lib/TrafficModel'),
      noop = () => null;

describe('LaneChangeDecider', () => {
  const newDecider = config => new LaneChangeDecider(config);

  describe('constructor', () => {
    it('defaults laneChangeDelayTicks property to zero', () => {
      expect(newDecider({}).laneChangeDelayTicks).toBe(0);
    });
  });

  describe('isChangingLanes', () => {
    let car = {timeDelayPercent: noop, timeSpeedupPercent: noop},
      model = newDecider({});

    describe('minTicksInLane condition', () => {
      it('returns true when elapsedTimeInLane equal to minTicksInLane', () => {
        model.minTicksInLane = 2;
        car.elapsedTimeInLane = 2;

        expect(model.isChangingLanes(car)).toBe(true);
      });

      it('returns false when elapsedTimeInLane less than minTicksInLane', () => {
        model.minTicksInLane = 3;
        car.elapsedTimeInLane = 2;

        expect(model.isChangingLanes(car)).toBe(false);
      });
    });

    describe('multiple conditions', () => {
      it('ignores unset conditions', () => {
        model = newDecider({
          minTickDelayPercent: 50,
          minTickSpeedupPercent: 20
        });
        car = {
          timeDelayPercent: () => 49,
          timeSpeedupPercent: () => 19,
          elapsedTimeInLane: 100
        };

        expect(model.isChangingLanes(car)).toBe(false);
      });

      it('returns false when one condition fails', () => {
        model = newDecider({
          minTickDelayPercent: 50,
          minTickSpeedupPercent: 20,
          minTicksInLane: 10
        });
        car = {
          timeDelayPercent: () => 50,
          timeSpeedupPercent: () => 20,
          elapsedTimeInLane: 9
        };

        expect(model.isChangingLanes(car)).toBe(false);
      });

      it('returns true when all conditions are met', () =>{
        model = newDecider({
          minTickDelayPercent: 50,
          minTickSpeedupPercent: 20,
          minTicksInLane: 10
        });
        car = {
          timeDelayPercent: () => 50,
          timeSpeedupPercent: () => 20,
          elapsedTimeInLane: 10
        };

        expect(model.isChangingLanes(car)).toBe(true);
      });
    });
  });
});
