'use strict';

class Car {
  constructor(totalTime) {
    this.elapsedTime = 0;
    this.totalTime = totalTime;
  }

  remainingTime() {
    return Math.max(this.totalTime - this.elapsedTime, 0);
  }

  tick() {
    this.elapsedTime++;
  }
}

module.exports = Car;
