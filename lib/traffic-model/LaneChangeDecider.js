'use strict';

const { isSet } = require(`../utils`);

class LaneChangeDecider {
  constructor({ laneChangeDelayTicks = 0, minTicksInLane, minTickDelayPercent, minTickSpeedupPercent }) {
    this.laneChangeDelayTicks = laneChangeDelayTicks;
    this.minTicksInLane = minTicksInLane;
    this.minTickDelayPercent = minTickDelayPercent;
    this.minTickSpeedupPercent = minTickSpeedupPercent;
  }

  hasLaneChangeConditions() {
    return isSet(this.minTicksInLane)
      || isSet(this.minTickDelayPercent)
      || isSet(this.minTickSpeedupPercent);
  }

  isChangingLanes(car, shorterLaneLength) {
    return this.isExceededMinTimeInLane(car)
      && this.isExceededMinLaneDelay(car)
      && this.isExceededMinTimeSaved(car, shorterLaneLength);
  }

  isExceededMinTimeSaved(car, shorterLaneLength) {
    if (!isSet(this.minTickSpeedupPercent))
      return true;

    return car.timeSpeedupPercent(shorterLaneLength, this.laneChangeDelayTicks) >= this.minTickSpeedupPercent;
  }

  isExceededMinLaneDelay(car) {
    if (!isSet(this.minTickDelayPercent))
      return true;

    return car.timeDelayPercent() >= this.minTickDelayPercent;
  }

  isExceededMinTimeInLane(car) {
    return !isSet(this.minTicksInLane) || car.elapsedTimeInLane >= this.minTicksInLane;
  }
}

module.exports = LaneChangeDecider;
