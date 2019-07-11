'use strict';

const root = '../../',
      { laneChangeConditions: { minTickDelayPercent, minTicksInLane } } = require(`${root}config`),
      { newArray2D, indexOfShortestLane } = require(`${root}lib/utils`),
      Road = require(`${root}lib/Road`);

module.exports = (arrivalSequence, road) => {
  let newLanes;

  arrivalSequence.forEach(isArrival => {
    newLanes = newArray2D(road.lanes.length);

    road.lanes.forEach((cars, laneIndex) => {
      cars.forEach(car => {
        if (car.timeInLane > minTicksInLane && car.timeDelayPercent() >= minTickDelayPercent) {
          // switch lanes
          car.timeInLane = 0;
          newLanes[Road.adjacentLaneIndexFor(laneIndex)].push(car);
        }
        else // remain in lane
          newLanes[laneIndex].push(car);
      });
    });

    // TODO: move lane switching logic to road object, i.e:
    //  - road.switchLanes(0, carsToSwitch[0])
    //  - road.switchLanes(1, carsToSwitch[1])

    road.lanes[0] = newLanes[0].slice();
    road.lanes[1] = newLanes[1].slice();

    // TODO: allow switching between levelled and random approach for car arrival via config.

    if (isArrival)
      road.addCar(indexOfShortestLane(road.lanes));

    road.tick();
  });
};
