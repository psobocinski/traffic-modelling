'use strict';

const chooseShortestLane = lanes => lanes.sort((lane1, lane2) => lane1.cars.length - lane2.cars.length)[0].name;

module.exports = (arrivalSequence, road) => {
  arrivalSequence.forEach(isArrival => {
    if (isArrival)
      road.addCar(chooseShortestLane(road.lanes));

    road.tick();
  });
};
