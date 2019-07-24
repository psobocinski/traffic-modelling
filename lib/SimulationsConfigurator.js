
const inquirer = require('inquirer');
const ConfigValidator = require('./ConfigValidator');
const { createConfigFile } = require('./utils/fileCreators');

function buildSimulationConfig(independentVariable, value) {
  return { [independentVariable]: value };
}

function buildSimulationsConfig(
  independentVariable,
  smallestValue,
  increment,
  numberOfSimulations,
) {
  return Array(numberOfSimulations)
    .fill()
    .map(
      (_, index) => buildSimulationConfig(
        independentVariable,
        smallestValue + increment * index,
      ),
    );
}

function processAnswers({
  independentVariable, smallestValue, increment, numberOfSimulations,
}) {
  const simulations = buildSimulationsConfig(
    independentVariable,
    parseFloat(smallestValue),
    parseFloat(increment),
    parseInt(numberOfSimulations, 10),
  );

  createConfigFile('simulations.json', simulations);
}

class SimulationsConfigurator {
  constructor(independentVariables) {
    this.independentVariables = independentVariables;
    this.validator = new ConfigValidator(independentVariables);
    this.prompt = inquirer.createPromptModule();
  }

  configure() {
    this.prompt(this.buildQuestions()).then(processAnswers);
  }

  buildQuestions() {
    return [
      {
        type: 'list',
        name: 'independentVariable',
        message: 'Select the independent variable',
        choices: this.independentVariables.map(({ name }) => name),
      },
      {
        name: 'smallestValue',
        message: 'Set variable\'s smallest value',
        validate: this.validator.validateSmallestValue.bind(this.validator),
      },
      {
        name: 'increment',
        message: 'Set variable\'s increment',
        validate: this.validator.validateIncrement.bind(this.validator),
      },
      {
        name: 'numberOfSimulations',
        message: 'Set number of simulations',
        validate: this.validator.constructor.validateNumberOfSimulations,
      },
    ];
  }
}

module.exports = SimulationsConfigurator;
