'use strict';

const { createConfigFile } = require('./lib/utils'),
  inquirer = require('inquirer'),
  independentVariables = [
    { name: 'laneChangeDelayTicks', type: 'number' },
    { name: 'minTicksInLane', type: 'integer', minimum: 0 },
    { name: 'minTickSpeedupPercent', type: 'number' },
    { name: 'numberOfLanes', type: 'integer', minimum: 2 }
  ],
  ConfigValidator = require('./lib/ConfigValidator');

function buildPrompts(independentVariables, validator) {
  return [
    {
      type: 'list',
      name: 'independentVariable',
      message: 'Select the independent variable',
      choices: independentVariables.map(({name}) => name)
    },
    {
      name: 'smallestValue',
      message: 'Set variable\'s smallest value',
      validate: validator.validateSmallestValue.bind(validator)
    },
    {
      name: 'increment',
      message: 'Set variable\'s increment',
      validate: validator.validateIncrement.bind(validator)
    },
    {
      name: 'numberOfSimulationRuns',
      message: 'Set number of simulation runs',
      validate: validator.validateNumberOfSimulations
    },
  ];
}

function processAnswers(configFileName) {
  return ({independentVariable, smallestValue, increment, numberOfSimulationRuns}) => {
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

    createConfigFile(configFileName, simulations);
  };
}

const validator = new ConfigValidator(independentVariables);

inquirer
  .prompt(buildPrompts(independentVariables, validator))
  .then(processAnswers('simulations.json'));
