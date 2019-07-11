
function arrayDifference(arr1, arr2) {
  return (arr1.filter(x => !arr2.includes(x)));
}

function newArray2D(arrayLength) {
  let newArray = [];

  for (let i = 0; i < arrayLength; i++)
    newArray[i] = [];

  return newArray;
}

function indexOfRandomLane(lanes) {
  return Math.floor(Math.random() * lanes.length);
}

function indexOfShortestLane(lanes) {
  return lanes.reduce(({ shortestIndex, shortestLength }, cars, index) => {
    if (shortestIndex === undefined || cars.length < shortestLength)
      [shortestIndex, shortestLength] = [index, cars.length];

    return { shortestIndex, shortestLength };
  }, {}).shortestIndex;
}

module.exports = { arrayDifference, newArray2D, indexOfRandomLane, indexOfShortestLane };