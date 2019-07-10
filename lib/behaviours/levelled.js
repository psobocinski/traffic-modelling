'use strict';

const chooseShortestLane = lanes => (
  Object.entries(lanes)
    .sort(([, lane1Cars], [, lane2Cars]) =>
      lane1Cars.length - lane2Cars.length
    )[0][0]
);

module.exports = (arrivalSequence, road) => {
  arrivalSequence.forEach(isArrival => {
    if (isArrival)
      road.addCar(chooseShortestLane(road.lanes));

    road.tick();
  });
};
