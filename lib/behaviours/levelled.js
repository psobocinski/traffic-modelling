'use strict';

const { indexOfShortestLane } = require('../../lib/utils');

module.exports = (arrivalSequence, road) => {
  arrivalSequence.forEach(isArrival => {

    // TODO: Add car to random lane initially, THEN change lanes to shortest one

    if (isArrival)
      road.addCar(indexOfShortestLane(road.lanes));

    road.tick();
  });
};
