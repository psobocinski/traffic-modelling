const { createConfigFile } = require('./lib/utils'),
  inquirer = require('inquirer'),
  independentVariables = [
    { name: 'laneChangeDelayTicks', type: 'number' },
    { name: 'minTicksInLane', type: 'integer', minimum: 0 },
    { name: 'minTickSpeedupPercent', type: 'number' },
    { name: 'numberOfLanes', type: 'integer', minimum: 2 }
  ],
  validators = {
    integer: input => Number.isInteger(parseFloat(input)) ? true : 'Must be an integer',
    number: input => Number.isNaN(parseFloat(input)) ? 'Must be a number' : true
  };

function validateSmallestValue(input, answers) {
  const selectedIndependentVariable = independentVariables.find(({ name }) =>
    name === answers.independentVariable);

  if (parseFloat(input) < selectedIndependentVariable.minimum)
    return `Must be greater than or equal to ${selectedIndependentVariable.minimum}`;

  return validators[selectedIndependentVariable.type](input);
}

function validateIncrement(input, answers) {
  const selectedIndependentVariable = independentVariables.find(({ name }) =>
    name === answers.independentVariable);

  if (parseFloat(input) <= 0)
    return 'Increment must be greater than 0';

  return validators[selectedIndependentVariable.type](input);
}

function validateNumberOfSimulations(input) {
  if (parseFloat(input) <= 0)
    return 'Number of simulations must be greater than 0';

  return validators.integer(input);
}

inquirer
  .prompt([
    {
      type: 'list',
      name: 'independentVariable',
      message: 'Select the independent variable',
      choices: independentVariables.map(({ name }) => name)
    },
    {
      name: 'smallestValue',
      message: 'Set variable\'s smallest value',
      validate: validateSmallestValue
    },
    {
      name: 'increment',
      message: 'Set variable\'s increment',
      validate: validateIncrement
    },
    {
      name: 'numberOfSimulationRuns',
      message: 'Set number of simulation runs',
      validate: validateNumberOfSimulations
    },
  ])
  .then(({ independentVariable, smallestValue, increment, numberOfSimulationRuns }) => {
    let simulation, simulations = [];

    for (let value = parseFloat(smallestValue); simulations.length < parseInt(numberOfSimulationRuns); value += parseFloat(increment)) {
      simulation = {};
      simulation[independentVariable] = value;
      simulations.push(simulation);
    }

    createConfigFile('simulations.json', simulations);
  });
