'use strict';

const { indexOfShortestLane } = require('../../lib/utils');

module.exports = (arrivalSequence, road) => {
  arrivalSequence.forEach(isArrival => {
    if (isArrival)
      road.addCar(indexOfShortestLane(road.lanes));

    road.tick();
  });
};
