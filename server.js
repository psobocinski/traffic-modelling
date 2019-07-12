'use strict';

const commonConfig = require('./config/common'),
      simulationsConfig = require('./config/simulations'),
      ArrivalSequence = require('./lib/ArrivalSequence'),
      Simulation = require('./lib/Simulation');

let arrivalSequence, config, simulation, simulations = [];

arrivalSequence = (new ArrivalSequence(commonConfig)).generate();

simulationsConfig.forEach(simulationConfig => {
  config = Object.assign(commonConfig, simulationConfig);
  simulation = new Simulation(config, arrivalSequence);
  simulations.push(simulation);
});

simulations[0].metricsCalculator.printCommonMetrics();
simulations.forEach(simulation => simulation.run());
