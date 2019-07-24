

const { createResultsFile } = require('./utils/fileCreators');
const Simulation = require('./Simulation');
const TableGenerator = require('./TableGenerator');

class SimulationRunner {
  constructor(commonConfig, simulationsConfig, executionModel) {
    this.commonConfig = commonConfig;
    this.simulationsConfig = simulationsConfig;
    this.executionModel = executionModel;
  }

  run() {
    let config;
    const simulations = [];

    this.simulationsConfig.forEach((simulationConfig) => {
      config = Object.assign({}, this.commonConfig.simulationDefaults, simulationConfig);
      simulations.push(
        new Simulation(this.commonConfig, config, this.executionModel),
      );
    });

    const simulationResults = simulations.map(simulation => simulation.run());
    const table = (new TableGenerator(this.commonConfig.output)).generate(simulationResults);

    createResultsFile(this.commonConfig.output, table);
  }
}

module.exports = SimulationRunner;
