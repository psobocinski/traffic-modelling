

const Road = require('./Road');
const MetricsCalculator = require('./MetricsCalculator');
const ArrivalSequence = require('./ArrivalSequence');
const LaneAssigner = require('./LaneAssigner');
const LaneChangeDecider = require('./LaneChangeDecider');

class TrafficModel {
  constructor(commonConfig) {
    this.arrivalSequence = (new ArrivalSequence(commonConfig)).generate();
    this.commonConfig = commonConfig;
  }

  run(config) {
    const metricsCalculator = new MetricsCalculator(this.commonConfig, config, this.arrivalSequence);
    const laneAssigner = new LaneAssigner(config);
    const laneChangeDecider = new LaneChangeDecider(config);
    const road = new Road(config, laneChangeDecider, metricsCalculator);

    this.arrivalSequence.forEach(isArrival => TrafficModel.tick(isArrival, laneAssigner, road));

    return metricsCalculator.complete(road);
  }

  static tick(isArrival, laneAssigner, road) {
    if (isArrival) road.addCar(laneAssigner.chooseLaneIndex(road.lanes));

    road.conditionallyChangeLanes();
    road.tick();
  }
}

module.exports = TrafficModel;
