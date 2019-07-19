'use strict';

const Road = require('./Road'),
      MetricsCalculator = require('./MetricsCalculator'),
      ArrivalSequence = require('./ArrivalSequence'),
      LaneChangeDecider = require('./LaneChangeDecider'),
      { indexOfRandomLane, indexOfShortestLane, isSet } = require(`../utils`),
      lanePlacementBehaviours = {
        levelled: indexOfShortestLane,
        random: indexOfRandomLane
      };

function chooseLaneIndex(lanePlacement, lanes) {
  return lanePlacementBehaviours[lanePlacement](lanes);
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

module.exports = TrafficModel;
