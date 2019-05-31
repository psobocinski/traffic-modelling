'use strict';

function chooseRandomLane() {
  return Math.random() < 0.5 ? 'left' : 'right';
}

module.exports = (arrivalSequence, road, recordMetricForTick) => {
  let carsExited;

  arrivalSequence.forEach(isArrival => {
    if (isArrival) road.addCar(chooseRandomLane());

    carsExited = road.tick();

    recordMetricForTick(carsExited);
  });
};
