class MetricsCalculator {
  constructor(simulationType) {
    this.simulationType = simulationType;
    this.carsExited = 0;
    this.carsOnRoadTime = 0;
    this.throughputsPerTick = [];
  }

  tick(carsExited) {
    const carsExitedForTick = carsExited.length,
      carsExitedTotalTime = carsExited.reduce((sum, car) => sum + car.totalTime, 0),
      throughputForTick = carsExitedTotalTime ? carsExitedForTick / carsExitedTotalTime : 0;

    this.carsExited += carsExitedForTick;
    this.carsOnRoadTime += carsExitedTotalTime;
    this.throughputsPerTick.push(throughputForTick);
  }

  complete(road) {
    this.printTitle();
    this.printMetrics();
    this.printDebugMetrics(road);
  }

  printTitle() {
    console.log(`\nMETRICS FOR SIMULATION TYPE '${this.simulationType}':`);
  }

  printMetrics() {
    const metricsLabels = {
      carsExited: 'Number of Cars exited',
      carsOnRoadTime: 'Total Time spent on Road by all Cars'
    };

    Object.entries(metricsLabels).forEach(([attribute, label]) =>
      console.log(`${label}:`, this[attribute])
    );
  }

  printDebugMetrics(road) {
    const averageThroughput = this.throughputsPerTick.length
            ? this.throughputsPerTick.reduce((sum, throughput) => sum + throughput) / this.throughputsPerTick.length
            : 0,
          totalThroughput = this.carsExited / this.carsOnRoadTime;

    console.log('averageThroughput', averageThroughput);
    console.log('totalThroughput', totalThroughput);

    console.log('Remaining cars in lanes:');
    console.log(road.lanes.map(lane => lane.cars.length));
  }

  static printCommonMetrics(arrivalSequence) {
    const simulationTime = arrivalSequence.length,
      carsEntered = arrivalSequence.filter(arrival => arrival).length;

    console.log('Elapsed Time of Simulation:', simulationTime);
    console.log('Number of Cars entered:', carsEntered);
  }
}

module.exports = MetricsCalculator;
