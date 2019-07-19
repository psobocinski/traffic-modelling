'use strict';

const Road = require('./Road'),
      MetricsCalculator = require('./MetricsCalculator'),
      ArrivalSequence = require('./ArrivalSequence'),
      LaneAssigner = require('./LaneAssigner'),
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
      laneAssigner = new LaneAssigner(config),
      laneChangeDecider = new LaneChangeDecider(config),
      road = new Road(config, laneChangeDecider, metricsCalculator);

    this.arrivalSequence.forEach(isArrival =>
      TrafficModel.tick(isArrival, laneAssigner, road));

    return metricsCalculator.complete(road);
  }

  static tick(isArrival, laneAssigner, road) {
    if (isArrival)
      road.addCar(laneAssigner.chooseLaneIndex(road.lanes));

    road.conditionallyChangeLanes();
    road.tick();
  }
}

module.exports = TrafficModel;
