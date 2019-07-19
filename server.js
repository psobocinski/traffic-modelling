'use strict';

const commonConfig = require('./config/common'),
  simulationsConfig = require('./config/simulations'),
  SimulationRunner = require('./lib/SimulationRunner'),
  { TrafficModel } = require('./lib/TrafficModel');

const trafficModel = new TrafficModel(commonConfig),
  runner = new SimulationRunner(commonConfig, simulationsConfig, trafficModel);

runner.run();
