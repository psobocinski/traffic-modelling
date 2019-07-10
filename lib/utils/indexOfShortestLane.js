module.exports = lanes => lanes.reduce(({ shortestIndex, shortestLength }, lane, index) => {
  if (shortestIndex === undefined || lane.cars.length < shortestLength)
    [shortestIndex, shortestLength] = [index, lane.cars.length];

  return { shortestIndex, shortestLength };
}, {}).shortestIndex;
