'use strict';

const SimulationRunner = require('../../lib/SimulationRunner'),
      noop = () => null;

describe('SimulationRunner', () => {
  let runner = new SimulationRunner({
    laneChangeConditions: {}
  });

  describe('isChangingLanes', () => {
    let car = {timeDelayPercent: noop, timeSpeedupPercent: noop};

    describe('minTicksInLane condition', () => {
      it('returns true when elapsedTimeInLane equal to minTicksInLane', () => {
        runner.laneChangeConditions.minTicksInLane = 2;
        car.elapsedTimeInLane = 2;

        expect(runner.isChangingLanes(car)).toBe(true);
      });

      it('returns false when elapsedTimeInLane less than minTicksInLane', () => {
        runner.laneChangeConditions.minTicksInLane = 3;
        car.elapsedTimeInLane = 2;

        expect(runner.isChangingLanes(car)).toBe(false);
      });
    });

    describe('multiple conditions', () => {
      it('ignores unset conditions', () => {
        runner.laneChangeConditions = {
          minTickDelayPercent: 50,
          minTickSpeedupPercent: 20
        };
        car = {
          timeDelayPercent: () => 49,
          timeSpeedupPercent: () => 19,
          elapsedTimeInLane: 100
        };

        expect(runner.isChangingLanes(car)).toBe(false);
      });

      it('returns false when one condition fails', () => {
        runner.laneChangeConditions = {
          minTickDelayPercent: 50,
          minTickSpeedupPercent: 20,
          minTicksInLane: 10
        };
        car = {
          timeDelayPercent: () => 50,
          timeSpeedupPercent: () => 20,
          elapsedTimeInLane: 9
        };

        expect(runner.isChangingLanes(car)).toBe(false);
      });

      it('returns true when all conditions are met', () =>{
        runner.laneChangeConditions = {
          minTickDelayPercent: 50,
          minTickSpeedupPercent: 20,
          minTicksInLane: 10
        };
        car = {
          timeDelayPercent: () => 50,
          timeSpeedupPercent: () => 20,
          elapsedTimeInLane: 10
        };

        expect(runner.isChangingLanes(car)).toBe(true);
      });
    });
  });
});
