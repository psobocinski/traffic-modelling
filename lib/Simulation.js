'use strict';

const Road = require('./Road'),
      SimulationRunner = require('./SimulationRunner');

class Simulation {
  constructor(behaviour, timeOnRoadFunction, arrivalSequence) {
    this.runner = new SimulationRunner(behaviour);
    this.road = new Road(timeOnRoadFunction, this.recordMetricsOnTick);
    this.arrivalSequence = arrivalSequence;
  }

  run() {
    console.log('totalCarsExited totalTimeForCarsExited throughputForTick');
    this.runner.run(this.arrivalSequence, this.road);
    this.recordMeticsOnCompletion(this.road);
  }

  // TODO: extract recordMetrics functions into class

  recordMetricsOnTick(carsExited) {
    const totalCarsExited = carsExited.length,
          totalTimeForCarsExited = carsExited.reduce((sum, car) => sum + car.totalTime, 0),
          throughputForTick = totalTimeForCarsExited ? totalCarsExited / totalTimeForCarsExited : 0;

    console.log(totalCarsExited, totalTimeForCarsExited, throughputForTick);

    // TODO: iterate through cars exited:
    //  - increment totalTimeForCarsExited
    //  - increment totalCarsExited
  }

  recordMeticsOnCompletion(road) {
    console.log('Remaining cars in lanes:');
    Object.entries(road.lanes).forEach(([laneName, cars]) =>
      console.log(laneName, cars.length)
    )
  }
}

module.exports = Simulation;
