'use strict';

const root = '../../',
      { laneChangeConditions: { minTickDelayPercent, minTicksInLane } } = require(`${root}config`),
      { newArray2D, indexOfShortestLane } = require(`${root}lib/utils`);

module.exports = (arrivalSequence, road) => {
  let newLanes;

  arrivalSequence.forEach(isArrival => {
    newLanes = newArray2D(road.lanes.length);

    road.lanes.forEach((cars, laneIndex) => {
      cars.forEach(car => {
        if (car.timeInLane > minTicksInLane && car.timeDelayPercent() >= minTickDelayPercent) {
          // switch lanes
          car.timeInLane = 0;
          newLanes[road.shortestAdjacentLaneIndexFor(laneIndex)].push(car);
        }
        else // remain in lane
          newLanes[laneIndex].push(car);
      });
    });

    // TODO: move lane switching logic to road object, i.e:
    //  - road.switchLanes(carsToSwitch)

    for (let i = 0; i < road.lanes.length; i++)
      road.lanes[i] = newLanes[i];

    // TODO: ALL behaviours should have the same initial lane placement, i.e. random

    if (isArrival)
      road.addCar(indexOfShortestLane(road.lanes));

    road.tick();
  });
};
