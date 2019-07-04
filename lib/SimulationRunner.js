'use strict';

const random = require('./behaviours/random'),
      levelled = require('./behaviours/levelled'),
      greedy = require('./behaviours/greedy'),
      behaviours = { random, levelled, greedy };

class SimulationRunner {
  constructor(behaviour) {
    this.run = behaviours[behaviour];
  }
}

module.exports = SimulationRunner;
