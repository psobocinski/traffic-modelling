'use strict';

const independentVariables = require('./lib/traffic-model/independentVariables'),
  SimulationsConfigurator = require('./lib/SimulationsConfigurator');

const configurator = new SimulationsConfigurator(independentVariables);

configurator.configure();
