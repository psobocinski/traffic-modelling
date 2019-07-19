'use strict';

const { createOutputFile } = require('./utils'),
  Simulation = require('./Simulation'),
  TableGenerator = require('./TableGenerator');

class SimulationRunner {
  constructor(commonConfig, simulationsConfig, executionModel) {
    this.commonConfig = commonConfig;
    this.simulationsConfig = simulationsConfig;
    this.executionModel = executionModel;
  }

  run() {
    let config, simulation, simulations = [], simulationResults, table;

    this.simulationsConfig.forEach(simulationConfig => {
      config = Object.assign({}, this.commonConfig.simulationDefaults, simulationConfig);
      simulation = new Simulation(this.commonConfig, config, this.executionModel);
      simulations.push(simulation);
    });

    // TODO: replace
    // simulations[0].metricsCalculator.printCommonMetrics();

    simulationResults = simulations.map(simulation =>
      simulation.run());

    table = (new TableGenerator(this.commonConfig.output)).generate(simulationResults);

    createOutputFile(this.commonConfig.output, table);
  }
}

module.exports = SimulationRunner;
