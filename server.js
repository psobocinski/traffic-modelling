'use strict';

const commonConfig = require('./config/common'),
  simulationsConfig = require('./config/simulations'),
  { createOutputFile } = require('./lib/utils'),
  { TrafficModel } = require('./lib/TrafficModel'),
  Simulation = require('./lib/Simulation'),
  TableGenerator = require('./lib/TableGenerator');

let config, simulation, simulations = [], simulationResults, table, trafficModel = new TrafficModel(commonConfig);

simulationsConfig.forEach(simulationConfig => {
  config = Object.assign({}, commonConfig.simulationDefaults, simulationConfig);
  simulation = new Simulation(commonConfig, config, trafficModel);
  simulations.push(simulation);
});

// TODO: replace
// simulations[0].metricsCalculator.printCommonMetrics();

simulationResults = simulations.map(simulation =>
  simulation.run());

table = (new TableGenerator(commonConfig.output)).generate(simulationResults);

createOutputFile(commonConfig.output, table);
