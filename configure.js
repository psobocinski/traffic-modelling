'use strict';

const independentVariables = require('./lib/traffic-model/independentVariables'),
  CommonConfigInitializer = require('./lib/CommonConfigInitializer'),
  SimulationsConfigurator = require('./lib/SimulationsConfigurator');

const configurator = new SimulationsConfigurator(independentVariables);

CommonConfigInitializer.initialize();
configurator.configure();
