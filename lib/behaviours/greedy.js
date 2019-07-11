'use strict';

const root = '../../',
      { laneChangeConditions: { minTickDelayPercent, minTicksInLane } } = require(`${root}config`),
      { indexOfShortestLane } = require(`${root}lib/utils`);

function isMetLaneChangeCondition(car) {
  return car.timeInLane > minTicksInLane &&
    car.timeDelayPercent() >= minTickDelayPercent;
}

module.exports = (arrivalSequence, road) => {
  arrivalSequence.forEach(isArrival => {
    // TODO: ALL behaviours should have the same initial lane placement, i.e. random

    if (isArrival)
      road.addCar(indexOfShortestLane(road.lanes));

    road.conditionallyChangeLanes(isMetLaneChangeCondition);
    road.tick();
  });
};
