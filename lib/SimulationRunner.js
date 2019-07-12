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
      road.conditionallyChangeLanes(this.isChangingLanes.bind(this));

    road.tick();
  }

  chooseLaneIndex(lanes) {
    return lanePlacementBehaviours[this.lanePlacement](lanes);
  }

  isChangingLanes(car) {
    const { minTicksInLane, minTickDelayPercent } = this.laneChangeConditions;

    return car.elapsedTimeInLane >= minTicksInLane &&
      car.timeDelayPercent() >= minTickDelayPercent;
  }
}

module.exports = SimulationRunner;
