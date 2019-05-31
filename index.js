'use strict';

const { arrivalProbability, durationInTicks, laneCapacity, timeOnRoadFunction } = require('./config/index'),
      ArrivalSequence = require('./lib/ArrivalSequence'),
      Simulation = require('./lib/Simulation');

const arrivalSequence = (new ArrivalSequence(durationInTicks, arrivalProbability)).generate,
      simulateRandom = new Simulation('random', laneCapacity, timeOnRoadFunction);

simulateRandom.run(arrivalSequence);
