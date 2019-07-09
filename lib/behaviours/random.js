'use strict';

const chooseRandomLane = laneNames =>laneNames[Math.round(Math.random())];

module.exports = (arrivalSequence, road) => {
  arrivalSequence.forEach(isArrival => {
    if (isArrival)
      road.addCar(chooseRandomLane(road.laneNames()));

    road.tick();
  });
};
