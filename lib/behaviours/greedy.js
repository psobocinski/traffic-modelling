'use strict';

const root = '../../',
      { laneChangeConditions: { minSlowdownPercent, minTicksInLane } } = require(`${root}config`),
      indexOfShortestLane = require(`${root}lib/utils/indexOfShortestLane`),
      Road = require(`${root}lib/Road`);

module.exports = (arrivalSequence, road) => {
  arrivalSequence.forEach(isArrival => {
    let newLanes = [ [], [] ];

    road.lanes.forEach((lane, laneIndex) => {
      lane.cars.forEach(car => {
        if (car.timeInLane > minTicksInLane && car.slowdownPercent() >= minSlowdownPercent) {
          // switch lanes
          car.timeInLane = 0;
          newLanes[Road.adjacentLaneIndexFor(laneIndex)].push(car);
        }
        else // remain in lane
          newLanes[laneIndex].push(car);
      });
    });

    road.lanes[0].cars = newLanes[0];
    road.lanes[1].cars = newLanes[1];

    if (isArrival)
      road.addCar(indexOfShortestLane(road.lanes));

    road.tick();
  });
};
