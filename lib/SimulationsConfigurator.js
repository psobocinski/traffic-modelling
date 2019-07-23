'use strict';

const inquirer = require('inquirer'),
  ConfigValidator = require('./ConfigValidator'),
  { createConfigFile } = require('./utils');

function processAnswers({independentVariable, smallestValue, increment, numberOfSimulationRuns}) {
  let simulation, simulations = [];

  for (
    let value = parseFloat(smallestValue);
    simulations.length < parseInt(numberOfSimulationRuns);
    value += parseFloat(increment)
  ) {
    simulation = {};
    simulation[independentVariable] = value;
    simulations.push(simulation);
  }

  createConfigFile('simulations.json', simulations);
}

class SimulationsConfigurator {
  constructor(independentVariables) {
    this.independentVariables = independentVariables;
    this.validator = new ConfigValidator(independentVariables);
    this.prompt = inquirer.createPromptModule();
  }

  configure() {
    this.prompt(this.buildPrompts()).then(processAnswers);
  }

  buildPrompts() {
    return [
      {
        type: 'list',
        name: 'independentVariable',
        message: 'Select the independent variable',
        choices: this.independentVariables.map(({name}) => name)
      },
      {
        name: 'smallestValue',
        message: 'Set variable\'s smallest value',
        validate: this.validator.validateSmallestValue.bind(this.validator)
      },
      {
        name: 'increment',
        message: 'Set variable\'s increment',
        validate: this.validator.validateIncrement.bind(this.validator)
      },
      {
        name: 'numberOfSimulationRuns',
        message: 'Set number of simulation runs',
        validate: this.validator.validateNumberOfSimulations
      },
    ];
  }
}

module.exports = SimulationsConfigurator;
