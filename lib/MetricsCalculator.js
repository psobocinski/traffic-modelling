class MetricsCalculator {
  constructor(arrivalSequence) {
    this.simulationTime = arrivalSequence.length;
    this.carsEntered = arrivalSequence.filter(arrival => arrival).length;
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
    this.printMetrics();
    this.printDebugMetrics(road);
  }

  printMetrics() {
    const metricsLabels = {
      simulationTime: 'Elapsed Time of Simulation',
      carsEntered: 'Number of Cars entered',
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
    Object.entries(road.lanes).forEach(([laneName, cars]) =>
      console.log(laneName, cars.length)
    )
  }
}

module.exports = MetricsCalculator;
