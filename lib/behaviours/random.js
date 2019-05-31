'use strict';

function chooseRandomLane() {
  return Math.random() < 0.5 ? 'left' : 'right';
}

module.exports = (arrivalSequence, recordMetricForTick) => {
  let carsExited;

  arrivalSequence.forEach(isArrival => {
    if (isArrival) this.road.addCar(chooseRandomLane());

    carsExited = this.road.tick();

    recordMetricForTick(carsExited);
  });
};
