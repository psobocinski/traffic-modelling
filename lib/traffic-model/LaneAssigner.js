

class LaneAssigner {
  constructor({ lanePlacement }) {
    const lanePlacementBehaviours = {
      levelled: LaneAssigner.indexOfShortestLane,
      random: LaneAssigner.indexOfRandomLane,
    };

    this.lanePlacementBehaviour = lanePlacementBehaviours[lanePlacement];
  }

  chooseLaneIndex(lanes) {
    return this.lanePlacementBehaviour(lanes);
  }

  static indexOfRandomLane(lanes) {
    return Math.floor(Math.random() * lanes.length);
  }

  static indexOfShortestLane(lanes) {
    return lanes.reduce(({ shortestIndex, shortestLength }, cars, index) => {
      if (shortestIndex === undefined || cars.length < shortestLength) [shortestIndex, shortestLength] = [index, cars.length];

      return { shortestIndex, shortestLength };
    }, {}).shortestIndex;
  }
}

module.exports = LaneAssigner;
