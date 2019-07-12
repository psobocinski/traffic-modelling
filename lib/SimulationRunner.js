'use strict';

const { indexOfRandomLane, indexOfShortestLane } = require(`./utils`);

class SimulationRunner {
  constructor({ lanePlacement, laneChangeConditions }) {
    this.lanePlacement = lanePlacement;
    this.laneChangeConditions = laneChangeConditions;
  }

  run(arrivalSequence, road) {
    arrivalSequence.forEach(isArrival => {
      if (isArrival)
        road.addCar(this.chooseLaneIndex(road.lanes));

      if (this.laneChangeConditions)
        road.conditionallyChangeLanes(this.isMetLaneChangeCondition.bind(this));

      road.tick();
    });
  }

  chooseLaneIndex(lanes) {
    const lanePlacementBehaviours = {
      levelled: indexOfShortestLane,
      random: indexOfRandomLane
    };

    return lanePlacementBehaviours[this.lanePlacement](lanes);
  }

  isMetLaneChangeCondition(car) {
    const { minTicksInLane, minTickDelayPercent } = this.laneChangeConditions;

    return car.timeInLane >= minTicksInLane &&
      car.timeDelayPercent() >= minTickDelayPercent;
  }
}

module.exports = SimulationRunner;
