'use strict';

const chooseShortestIndex = lanes => lanes.reduce(({ shortestIndex, shortestLength }, lane, index) => {
  if (shortestIndex === undefined || lane.cars.length < shortestLength)
    [shortestIndex, shortestLength] = [index, lane.cars.length];

  return { shortestIndex, shortestLength };
}, {}).shortestIndex;

module.exports = (arrivalSequence, road) => {
  arrivalSequence.forEach(isArrival => {
    if (isArrival)
      road.addCar(chooseShortestIndex(road.lanes));

    road.tick();
  });
};
