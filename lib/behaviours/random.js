'use strict';

const indexOfRandomLane = lanes => Math.floor(Math.random() * lanes.length);

module.exports = (arrivalSequence, road) => {
  arrivalSequence.forEach(isArrival => {
    if (isArrival)
      road.addCar(indexOfRandomLane(road.lanes));

    road.tick();
  });
};
