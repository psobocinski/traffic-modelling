class MetricsCalculator {
  constructor({ lanePlacement, laneChangeConditions }, arrivalSequence) {
    this.lanePlacement = lanePlacement;
    this.laneChangeConditions = laneChangeConditions;
    this.simulationTime = arrivalSequence.length;
    this.carsEntered = arrivalSequence.filter(arrival => arrival).length;
    this.carsExited = 0;
    this.carsExitedAggregateTime = 0;
    this.carsRemainingAggregateTime = null;
    this.throughputsPerTick = [];
  }

  tick(carsExited) {
    const carsExitedForTick = carsExited.length,
      carsExitedTotalTime = carsExited.reduce((sum, car) => sum + car.totalTime, 0),
      throughputForTick = carsExitedTotalTime ? carsExitedForTick / carsExitedTotalTime : 0;

    this.carsExited += carsExitedForTick;
    this.carsExitedAggregateTime += carsExitedTotalTime;
    this.throughputsPerTick.push(throughputForTick);
  }

  complete(road) {
    this.carsRemainingAggregateTime = road.lanes.reduce((laneSum, cars) =>
      laneSum + cars.reduce((carSum, car) =>
        carSum + car.elapsedTime, 0), 0);

    this.printTitle();
    this.printMetrics();
    MetricsCalculator.printDebugMetrics(road);
  }

  carsRemaining() {
    return this.carsEntered - this.carsExited;
  }

  carsOnRoadAggregateTime() {
    return this.carsExitedAggregateTime + this.carsRemainingAggregateTime;
  }

  averageThroughput() {
    if (this.throughputsPerTick.length === 0)
      return 0;

    return this.throughputsPerTick.reduce((sum, throughput) => sum + throughput) / this.throughputsPerTick.length;
  }

  overallThroughput() {
    return this.carsExited / this.carsExitedAggregateTime;
  }

  printTitle() {
    let title = `METRICS FOR ${this.lanePlacement}`;

    if (this.laneChangeConditions)
      title += ' WITH LANE CHANGES';

    console.log(`\n${title}':`);
  }

  printCommonMetrics() {
    console.log('Elapsed Time of Simulation:', this.simulationTime);
    console.log('Number of Cars entered:', this.carsEntered);
  }

  printMetrics() {
    console.log('Number of Cars remaining on Road', this.carsRemaining());
    console.log('Aggregate Time spent on Road by all Cars', this.carsOnRoadAggregateTime());
    console.log('Overall Throughput', this.overallThroughput());
    console.log('Average Throughput per tick', this.averageThroughput());
  }

  static printDebugMetrics(road) {
    const remainingCarCounts = road.lanes.map(cars => cars.length);

    console.log('Remaining cars in lanes:', remainingCarCounts);
  }
}

module.exports = MetricsCalculator;
