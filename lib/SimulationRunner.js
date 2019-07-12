'use strict';

const { indexOfRandomLane, indexOfShortestLane } = require(`./utils`),
      lanePlacementBehaviours = {
        levelled: indexOfShortestLane,
        random: indexOfRandomLane
      };

class SimulationRunner {
  constructor({ lanePlacement, laneChangeConditions }) {
    this.lanePlacement = lanePlacement;
    this.laneChangeConditions = laneChangeConditions;
  }

  run(arrivalSequence, road) {
    arrivalSequence.forEach(isArrival =>
      this.tick(isArrival, road));
  }

  tick(isArrival, road) {
    if (isArrival)
      road.addCar(this.chooseLaneIndex(road.lanes));

    if (this.laneChangeConditions)
      road.conditionallyChangeLanes(this.isMetLaneChangeCondition.bind(this));

    road.tick();
  }

  chooseLaneIndex(lanes) {
    return lanePlacementBehaviours[this.lanePlacement](lanes);
  }

  isMetLaneChangeCondition(car) {
    const { minTicksInLane, minTickDelayPercent } = this.laneChangeConditions;

    return car.timeInLane >= minTicksInLane &&
      car.timeDelayPercent() >= minTickDelayPercent;
  }
}

module.exports = SimulationRunner;
