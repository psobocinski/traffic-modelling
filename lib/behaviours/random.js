'use strict';

const { indexOfRandomLane } = require(`../../lib/utils`);

module.exports = (arrivalSequence, road) => {
  arrivalSequence.forEach(isArrival => {
    if (isArrival)
      road.addCar(indexOfRandomLane(road.lanes));

    road.tick();
  });
};
