

const independentVariables = require('../lib/traffic-model/independentVariables');
const CommonConfigInitializer = require('../lib/CommonConfigInitializer');
const SimulationsConfigurator = require('../lib/SimulationsConfigurator');

const configurator = new SimulationsConfigurator(independentVariables);

CommonConfigInitializer.initialize();
configurator.configure();
