'use strict';

const commonConfig = require('./config/common'),
  simulationsConfig = require('./config/simulations'),
  { createOutputFile } = require('./lib/utils'),
  ArrivalSequence = require('./lib/ArrivalSequence'),
  Simulation = require('./lib/Simulation'),
  TableGenerator = require('./lib/TableGenerator');

let arrivalSequence, config, simulation, simulations = [], simulationResults, table;

arrivalSequence = (new ArrivalSequence(commonConfig)).generate();

simulationsConfig.forEach(simulationConfig => {
  config = Object.assign({}, commonConfig, simulationConfig);
  simulation = new Simulation(config, arrivalSequence);
  simulations.push(simulation);
});

simulations[0].metricsCalculator.printCommonMetrics();

simulationResults = simulations.map(simulation =>
  simulation.run());

table = (new TableGenerator(commonConfig.output.format)).generate(simulationResults);

createOutputFile(commonConfig.output, table);
