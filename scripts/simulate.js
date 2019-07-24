

const commonConfig = require('../config/common');
const simulationsConfig = require('../config/simulations');
const SimulationRunner = require('../lib/SimulationRunner');
const TrafficModel = require('../lib/traffic-model/TrafficModel');

const trafficModel = new TrafficModel(commonConfig);
const runner = new SimulationRunner(commonConfig, simulationsConfig, trafficModel);

runner.run();
