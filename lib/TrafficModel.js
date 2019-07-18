'use strict';

const { indexOfRandomLane, indexOfShortestLane, isSet } = require(`./utils`),
      lanePlacementBehaviours = {
        levelled: indexOfShortestLane,
        random: indexOfRandomLane
      };

class TrafficModel {
  constructor({ laneChangeDelayTicks, lanePlacement, minTickDelayPercent, minTicksInLane, minTickSpeedupPercent }) {
    this.laneChangeDelayTicks = laneChangeDelayTicks;
    this.lanePlacement = lanePlacement;
    this.minTickDelayPercent = minTickDelayPercent;
    this.minTicksInLane = minTicksInLane;
    this.minTickSpeedupPercent = minTickSpeedupPercent;
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
    return isSet(this.minTicksInLane)
      || isSet(this.minTickDelayPercent)
      || isSet(this.minTickSpeedupPercent);
  }

  isChangingLanes(car, shorterLaneLength) {
    return (!isSet(this.minTicksInLane) || car.elapsedTimeInLane >= this.minTicksInLane)
      && (!isSet(this.minTickDelayPercent) || car.timeDelayPercent() >= this.minTickDelayPercent)
      && (!isSet(this.minTickSpeedupPercent)
        || car.timeSpeedupPercent(shorterLaneLength, this.laneChangeDelayTicks) >= this.minTickSpeedupPercent);
  }
}

module.exports = TrafficModel;
