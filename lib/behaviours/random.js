'use strict';

const chooseRandomIndex = arrayLength => Math.floor(Math.random() * arrayLength);

module.exports = (arrivalSequence, road) => {
  arrivalSequence.forEach(isArrival => {
    if (isArrival)
      road.addCar(chooseRandomIndex(road.lanes.length));

    road.tick();
  });
};
