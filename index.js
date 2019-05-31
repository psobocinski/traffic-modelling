'use strict';

const { arrivalProbability, durationInTicks, timeOnRoadFunction } = require('./config/index'),
      ArrivalSequence = require('./lib/ArrivalSequence'),
      Simulation = require('./lib/Simulation');

const arrivalSequence = (new ArrivalSequence(durationInTicks, arrivalProbability)).generate(),
      simulateRandom = new Simulation('random', timeOnRoadFunction);

simulateRandom.run(arrivalSequence);
