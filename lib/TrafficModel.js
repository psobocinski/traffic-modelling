'use strict';

const Road = require('./Road'),
      MetricsCalculator = require('./MetricsCalculator'),
      ArrivalSequence = require('./ArrivalSequence'),
      { indexOfRandomLane, indexOfShortestLane, isSet } = require(`./utils`),
      lanePlacementBehaviours = {
        levelled: indexOfShortestLane,
        random: indexOfRandomLane
      };

function chooseLaneIndex(lanePlacement, lanes) {
  return lanePlacementBehaviours[lanePlacement](lanes);
}

class LaneChangeDecider {
  constructor({ laneChangeDelayTicks, minTicksInLane, minTickDelayPercent, minTickSpeedupPercent, }) {
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

class TrafficModel {
  constructor(commonConfig) {
    this.arrivalSequence = (new ArrivalSequence(commonConfig)).generate();
    this.commonConfig = commonConfig;
  }

  run(config) {
    let metricsCalculator = new MetricsCalculator(this.commonConfig, config, this.arrivalSequence),
      laneChangeDecider = new LaneChangeDecider(config),
      road = new Road(config, laneChangeDecider, metricsCalculator);

    console.log('\nhasLaneChangeConditions:', laneChangeDecider.hasLaneChangeConditions());
    console.log('laneChangeDecider:', laneChangeDecider);

    this.arrivalSequence.forEach(isArrival =>
      TrafficModel.tick(isArrival, config, road));

    return metricsCalculator.complete(road);
  }

  static tick(isArrival, { lanePlacement }, road) {
    if (isArrival)
      road.addCar(chooseLaneIndex(lanePlacement, road.lanes));

    road.conditionallyChangeLanes();
    road.tick();
  }
}

module.exports = { LaneChangeDecider, TrafficModel };
