'use strict';

function chooseRandomLane(laneNames) {
  return laneNames[Math.round(Math.random())];
}

module.exports = (arrivalSequence, road, recordMetricForTick) => {
  let carsExited;

  arrivalSequence.forEach(isArrival => {
    if (isArrival) road.addCar(chooseRandomLane(road.laneNames()));

    carsExited = road.tick();

    recordMetricForTick(carsExited);
  });
};
