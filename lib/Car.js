'use strict';

class Car {
  constructor(timeOnRoadCalculator, totalCarsInLane) {
    this.timeOnRoadCalculator = timeOnRoadCalculator;
    this.reCalculateTotalTime(totalCarsInLane);
    this.priorTotalTime = this.totalTime;
    this.timeInLane = 0;
    this.elapsedTime = 0;
  }

  reCalculateTotalTime(totalCarsInLane) {
    this.priorTotalTime = this.totalTime;
    this.totalTime = this.timeOnRoadCalculator(totalCarsInLane);
  }

  remainingTime() {
    return Math.max(this.totalTime - this.elapsedTime, 0);
  }

  slowdownPercent() {
    return ((this.totalTime - this.priorTotalTime) / this.priorTotalTime) * 100;
  }

  tick() {
    this.elapsedTime++;
    this.timeInLane++;
  }
}

module.exports = Car;
