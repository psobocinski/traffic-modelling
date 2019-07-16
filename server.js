'use strict';

const commonConfig = require('./config/common'),
      simulationsConfig = require('./config/simulations'),
      ArrivalSequence = require('./lib/ArrivalSequence'),
      MetricsCalculator = require('./lib/MetricsCalculator'),
      Simulation = require('./lib/Simulation');

let arrivalSequence, config, simulation, simulations = [];

arrivalSequence = (new ArrivalSequence(commonConfig)).generate();

simulationsConfig.forEach(simulationConfig => {
  config = Object.assign({}, commonConfig, simulationConfig);
  simulation = new Simulation(config, arrivalSequence);
  simulations.push(simulation);
});

simulations[0].metricsCalculator.printCommonMetrics();

for (let i = 1; i <= commonConfig.numberOfIterations; i++) {
  console.log(`\n\nITERATION ${i}`);

  MetricsCalculator.printTableHeaders(commonConfig.outputFormat);

  simulations.forEach(simulation =>
    simulation.run());
}
