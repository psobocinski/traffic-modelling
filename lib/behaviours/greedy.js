'use strict';

const root = '../../',
      { laneChangeConditions: { minTickDelayPercent, minTicksInLane } } = require(`${root}config`),
      { newArray2D, indexOfShortestLane } = require(`${root}lib/utils`);

function isMetLaneChangeConditionFor(car) {
  return car.timeInLane > minTicksInLane &&
    car.timeDelayPercent() >= minTickDelayPercent;
}

function changeLanes(road) {
  let carsToSwitch = newArray2D(road.lanes.length);

  road.lanes.forEach((cars, laneIndex) =>
    carsToSwitch[laneIndex] = cars.filter(car =>
      isMetLaneChangeConditionFor(car)));

  road.changeLane(carsToSwitch);
}

module.exports = (arrivalSequence, road) => {
  arrivalSequence.forEach(isArrival => {
    changeLanes(road);

    // TODO: ALL behaviours should have the same initial lane placement, i.e. random

    if (isArrival)
      road.addCar(indexOfShortestLane(road.lanes));

    road.tick();
  });
};
