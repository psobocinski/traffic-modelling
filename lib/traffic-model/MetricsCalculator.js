

const { isSet } = require('../utils');

class MetricsCalculator {
  constructor(
    { output },
    {
      laneChangeDelayTicks, lanePlacement, minTickDelayPercent, minTicksInLane, minTickSpeedupPercent, numberOfLanes,
    },
    arrivalSequence,
  ) {
    this.columnMetrics = output.columns.map(([metric]) => metric);

    // SIMULATION METRICS
    this.simulationTime = () => arrivalSequence.length;
    this.carsEntered = () => arrivalSequence.filter(arrival => arrival).length;

    // INDEPENDENT VARIABLES
    this.laneChangeDelayTicks = () => laneChangeDelayTicks;
    this.lanePlacement = () => lanePlacement;
    this.minTickDelayPercent = () => minTickDelayPercent;
    this.minTicksInLane = () => minTicksInLane;
    this.minTickSpeedupPercent = () => minTickSpeedupPercent;
    this.numberOfLanes = () => numberOfLanes;

    this.carsExited = 0;
    this.carsExitedAggregateTime = 0;
    this.carsRemainingAggregateTime = null;
    this.throughputsPerTick = [];
    this.laneChanges = 0;
  }

  // DEPENDENT VARIABLES
  // - averageTimeOnRoad()
  // - carsRemaining()
  // - carsOnRoadAggregateTime()
  // - totalLaneChanges()
  // - overallThroughput()
  // - averageThroughput()

  averageTimeOnRoad() {
    const avgTime = this.carsExitedAggregateTime / this.carsExited;

    return Math.round(avgTime * 10) / 10;
  }

  carsRemaining() {
    return this.carsEntered() - this.carsExited;
  }

  carsOnRoadAggregateTime() {
    return this.carsExitedAggregateTime + this.carsRemainingAggregateTime;
  }

  totalLaneChanges() {
    return this.laneChanges;
  }

  overallThroughput() {
    const throughput = this.carsExited / this.carsExitedAggregateTime * 100;

    return Math.round(throughput * 100) / 100;
  }

  averageThroughput() {
    if (this.throughputsPerTick.length === 0) return 0;

    const avgThroughput = this.throughputsPerTick.reduce((sum, throughput) => sum + throughput)
      / this.throughputsPerTick.length
      * 100;

    return Math.round(avgThroughput * 100) / 100;
  }

  tick(carsExited) {
    const carsExitedForTick = carsExited.length;
    const carsExitedTotalTime = carsExited.reduce((sum, car) => sum + car.totalTime, 0);
    const throughputForTick = carsExitedTotalTime ? carsExitedForTick / carsExitedTotalTime : 0;

    this.carsExited += carsExitedForTick;
    this.carsExitedAggregateTime += carsExitedTotalTime;
    this.throughputsPerTick.push(throughputForTick);
  }

  complete(road) {
    this.carsRemainingAggregateTime = road.lanes.reduce((laneSum, cars) => laneSum + cars.reduce((carSum, car) => carSum + car.elapsedTime, 0), 0);

    this.printSimulationInfo();
    this.printMetrics();
    this.printDebugMetrics(road);

    return this.results();
  }

  results() {
    return this.columnMetrics.map(metric => this[metric]());
  }

  printSimulationInfo() {
    const laneChangeProperties = ['minTickDelayPercent', 'minTicksInLane', 'minTickSpeedupPercent'];
    const laneChangeConditions = laneChangeProperties.reduce((acc, laneChangeProperty) => {
      const propValue = this[laneChangeProperty]();
      if (isSet(propValue)) acc[laneChangeProperty] = propValue;
      return acc;
    }, {});

    console.log('\nLane placement', this.lanePlacement());
    console.log('Lane Change Delay', this.laneChangeDelayTicks());
    console.log('Lane Change Conditions', laneChangeConditions);
  }

  printMetrics() {
    console.log('Average Time', this.averageTimeOnRoad());
    console.log('Cars Remaining', this.carsRemaining());
    console.log('Aggregate Time', this.carsOnRoadAggregateTime());
    console.log('Aggregate Throughput', this.overallThroughput());
  }

  printDebugMetrics(road) {
    const remainingCarCounts = road.lanes.map(cars => cars.length);

    console.log('Average Throughput per tick', this.averageThroughput());
    console.log('Number of Lane changes', this.totalLaneChanges());
    console.log('Remaining cars in lanes:', remainingCarCounts);
  }
}

module.exports = MetricsCalculator;
