'use strict';

const { indexOfRandomLane, indexOfShortestLane } = require(`../utils`),
  lanePlacementBehaviours = {
    levelled: indexOfShortestLane,
    random: indexOfRandomLane
  };

class LaneAssigner {
  constructor({ lanePlacement }) {
    this.lanePlacementBehaviour = lanePlacementBehaviours[lanePlacement];
  }

  chooseLaneIndex(lanes) {
    return this.lanePlacementBehaviour(lanes);
  }
}

module.exports = LaneAssigner;
