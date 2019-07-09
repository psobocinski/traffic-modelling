'use strict';

const { arrivalProbability, durationInTicks, timeOnRoadFunction } = require('./config'),
      ArrivalSequence = require('./lib/ArrivalSequence'),
      Simulation = require('./lib/Simulation'),
      MetricsCalculator = require('./lib/MetricsCalculator');

const arrivalSequence = (new ArrivalSequence(durationInTicks, arrivalProbability)).generate(),
      simulateRandom = new Simulation('random', timeOnRoadFunction, arrivalSequence);

MetricsCalculator.printCommonMetrics(arrivalSequence);

simulateRandom.run();
