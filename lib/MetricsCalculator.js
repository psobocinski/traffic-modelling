const supportedOutputFormats = ['markdown', 'csv'];

class MetricsCalculator {
  constructor({ lanePlacement, laneChangeConditions, laneChangeDelayTicks, outputFormat }, arrivalSequence) {
    this.lanePlacement = lanePlacement;
    this.laneChangeConditions = laneChangeConditions;
    this.laneChangeDelayTicks = laneChangeDelayTicks;
    this.outputFormat = outputFormat;
    this.simulationTime = arrivalSequence.length;
    this.carsEntered = arrivalSequence.filter(arrival => arrival).length;
    this.carsExited = 0;
    this.carsExitedAggregateTime = 0;
    this.carsRemainingAggregateTime = null;
    this.throughputsPerTick = [];
    this.laneChanges = 0;
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

    if (supportedOutputFormats.includes(this.outputFormat)) {
      this.printTable(this.outputFormat);
    } else {
      this.printSimulationInfo();
      this.printMetrics();
      this.printDebugMetrics(road);
    }
  }

  carsRemaining() {
    return this.carsEntered - this.carsExited;
  }

  carsOnRoadAggregateTime() {
    return this.carsExitedAggregateTime + this.carsRemainingAggregateTime;
  }

  averageTimeOnRoad() {
    const avgTime = this.carsExitedAggregateTime / this.carsExited;

    return Math.round(avgTime * 10) / 10;
  }

  averageThroughput() {
    if (this.throughputsPerTick.length === 0)
      return 0;

    const avgThroughput = this.throughputsPerTick.reduce((sum, throughput) => sum + throughput)
      / this.throughputsPerTick.length
      * 100;

    return Math.round(avgThroughput * 100) / 100;
  }

  overallThroughput() {
    const throughput = this.carsExited / this.carsExitedAggregateTime * 100;

    return Math.round(throughput * 100) / 100;
  }

  printTable(format) {
    const { minTicksInLane = 'n/a', minTickSpeedupPercent = 'n/a'} = this.laneChangeConditions || {};
    let cols, rowContent;

    cols = [
      minTicksInLane,
      minTickSpeedupPercent,
      this.averageTimeOnRoad(),
      this.carsRemaining(),
      this.carsOnRoadAggregateTime(),
      this.overallThroughput()
    ];

    switch (format) {
      case 'csv':
        rowContent = cols.join(',');
        break;
      case 'markdown':
        rowContent = `| ${cols.join(' | ')} |`;
        break;
    }

    console.log(rowContent);
  }

  static printTableHeaders(format) {
    if (!supportedOutputFormats.includes(format))
      return;

    let cols, tableHeaderContent, headerSeparator;

    cols = [
      'Min Time in Lane',
      'Time Saved %',
      'Avg Time',
      'Cars Remain',
      'Agg Time',
      'Agg TP n / 100 ticks',
    ];

    switch (format) {
      case 'csv':
        tableHeaderContent = cols.join(',');
        break;
      case 'markdown':
        tableHeaderContent = `| ${cols.join(' | ')} |`;
        headerSeparator = `| ${cols.map(col => '-'.repeat(col.length)).join(' | ')} |`;
        break;
    }

    console.log(tableHeaderContent);
    if (headerSeparator)
      console.log(headerSeparator);
  }

  printSimulationInfo() {
    console.log('\nLane placement', this.lanePlacement);
    console.log('Lane Change Delay', this.laneChangeDelayTicks);
    console.log('Lane Change Conditions', this.laneChangeConditions || 'n/a');
  }

  printCommonMetrics() {
    console.log('Elapsed Time of Simulation:', this.simulationTime);
    console.log('Number of Cars entered:', this.carsEntered);
  }

  printMetrics() {
    console.log('Average Time', this.averageTimeOnRoad());
    console.log('Cars Remaining', this.carsRemaining());
    console.log('Aggregate Time', this.carsOnRoadAggregateTime());
    console.log('Aggregate Throughput', this.overallThroughput());
  }

  printDebugMetrics(road) {
    console.log('Average Throughput per tick', this.averageThroughput());
    console.log('Number of Lane changes', this.laneChanges);
    console.log('Remaining cars in lanes:', MetricsCalculator.remainingCarCounts(road));
  }

  static remainingCarCounts(road) {
    return road.lanes.map(cars => cars.length)
  }
}

module.exports = MetricsCalculator;
