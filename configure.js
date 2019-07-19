const fs = require('fs'),
  inquirer = require('inquirer'),
  independentVariables = [
    'laneChangeDelayTicks',
    'minTicksInLane',
    'minTickSpeedupPercent',
    'numberOfLanes'
  ],
  outputPathAndFilename = './config/simulations.json';

let simulations = [];

inquirer
  .prompt([
    {
      type: 'list',
      name: 'independentVariable',
      message: 'Select the independent variable:',
      choices: independentVariables
    },
    {
      type: 'number',
      name: 'smallestValue',
      message: 'Set variable\'s smallest value'
    },
    {
      type: 'number',
      name: 'increment',
      message: 'Set variable\'s increment'
    },
    {
      type: 'number',
      name: 'numberOfSimulationRuns',
      message: 'Set number of simulation runs'
    },
  ])
  .then(({ independentVariable, smallestValue, increment, numberOfSimulationRuns }) => {
    let simulation;

    for (let value = smallestValue; simulations.length < numberOfSimulationRuns; value += increment) {
      simulation = {};
      simulation[independentVariable] = value;
      simulations.push(simulation);
    }

    fs.writeFile(outputPathAndFilename, JSON.stringify(simulations, null, 2), function(err) {
      if(err) return console.log(err);

      console.log(`results outputted to file: ${outputPathAndFilename}`);
    });
  });
