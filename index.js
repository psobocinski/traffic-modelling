'use strict';

const { arrivalProbability, durationInTicks, laneCapacity, timeOnRoadFunction } = require('./config/index'),
      ArrivalSequence = require('./lib/ArrivalSequence'),
      Simulation = require('./lib/Simulation');

const arrivalSequence = (new ArrivalSequence(durationInTicks, arrivalProbability)).generate,
      simulation = new Simulation(laneCapacity, timeOnRoadFunction);

simulation.random(arrivalSequence);
