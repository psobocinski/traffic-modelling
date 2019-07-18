'use strict';

const { indexOfRandomLane, indexOfShortestLane } = require(`./utils`),
      lanePlacementBehaviours = {
        levelled: indexOfShortestLane,
        random: indexOfRandomLane
      };

class TrafficModel {
  constructor({ lanePlacement, laneChangeConditions, laneChangeDelayTicks }) {
    this.lanePlacement = lanePlacement;
    this.laneChangeConditions = laneChangeConditions;
    this.laneChangeDelayTicks = laneChangeDelayTicks;
  }

  run(arrivalSequence, road) {
    arrivalSequence.forEach(isArrival =>
      this.tick(isArrival, road));
  }

  tick(isArrival, road) {
    if (isArrival)
      road.addCar(this.chooseLaneIndex(road.lanes));

    if (this.hasLaneChangeConditions())
      road.conditionallyChangeLanes(this.isChangingLanes.bind(this));

    road.tick();
  }

  chooseLaneIndex(lanes) {
    return lanePlacementBehaviours[this.lanePlacement](lanes);
  }

  hasLaneChangeConditions() {
    return this.laneChangeConditions && this.laneChangeConditions !== {};
  }

  isChangingLanes(car, shorterLaneLength) {
    const { minTicksInLane, minTickDelayPercent, minTickSpeedupPercent } = this.laneChangeConditions;

    return (minTicksInLane === undefined || car.elapsedTimeInLane >= minTicksInLane)
      && (minTickDelayPercent === undefined || car.timeDelayPercent() >= minTickDelayPercent)
      && (minTickSpeedupPercent === undefined
        || car.timeSpeedupPercent(shorterLaneLength, this.laneChangeDelayTicks) >= minTickSpeedupPercent);
  }
}

module.exports = TrafficModel;
