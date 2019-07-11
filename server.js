'use strict';

const config = require('./config'),
      ArrivalSequence = require('./lib/ArrivalSequence'),
      Simulation = require('./lib/Simulation');

const arrivalSequence = (new ArrivalSequence(config)).generate(),
      simulateRandom = new Simulation('random', config, arrivalSequence),
      simulateLevelled = new Simulation('levelled', config, arrivalSequence),
      simulateGreedy = new Simulation('greedy', config, arrivalSequence);

simulateRandom.metricsCalculator.printCommonMetrics();

simulateRandom.run();
simulateLevelled.run();
simulateGreedy.run();
