'use strict';

const indexOfRandomLane = arrayLength => Math.floor(Math.random() * arrayLength);

module.exports = (arrivalSequence, road) => {
  arrivalSequence.forEach(isArrival => {
    if (isArrival)
      road.addCar(indexOfRandomLane(road.lanes.length));

    road.tick();
  });
};
