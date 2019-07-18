'use strict';

const TrafficModel = require('../../lib/TrafficModel'),
      noop = () => null;

describe('TrafficModel', () => {
  const newModel = config => new TrafficModel(config);

  describe('isChangingLanes', () => {
    let car = {timeDelayPercent: noop, timeSpeedupPercent: noop},
      model = newModel({});

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
        model = newModel({
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
        model = newModel({
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
        model = newModel({
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
