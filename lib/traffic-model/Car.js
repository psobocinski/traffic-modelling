

class Car {
  constructor(timeOnRoadCalculator, totalCarsInLane) {
    this.timeOnRoadCalculator = timeOnRoadCalculator;
    this.elapsedTimeInLane = 0;
    this.elapsedTime = 0;
    this.timeSpentOnLaneChanges = 0;
    this.totalTime = this.timeOnRoadCalculator(totalCarsInLane);
    this.priorRemainingTime = this.remainingTime();
  }

  reCalculateTotalTime(totalCarsInLane) {
    this.priorRemainingTime = this.remainingTime();
    this.totalTime = this.calculateTotalTimeFor(totalCarsInLane);
  }

  adjustTimesForLaneChange(laneChangeDelayTicks) {
    this.elapsedTimeInLane = 0;
    this.timeSpentOnLaneChanges += laneChangeDelayTicks;
  }

  remainingTime() {
    return Math.max(this.totalTime - this.elapsedTime, 0);
  }

  timeDelayPercent() {
    return (this.remainingTime() - this.priorRemainingTime) / this.priorRemainingTime * 100;
  }

  timeSpeedupPercent(shorterLaneLength, laneChangeDelayTicks) {
    const totalTimeInShorterLane = this.calculateTotalTimeFor(shorterLaneLength)
      + laneChangeDelayTicks;
    const remainingTimeInShorterLane = Math.max(totalTimeInShorterLane - this.elapsedTime, 0);

    return (this.remainingTime() - remainingTimeInShorterLane) / remainingTimeInShorterLane * 100;
  }

  calculateTotalTimeFor(laneLength) {
    return this.timeOnRoadCalculator(laneLength) + this.timeSpentOnLaneChanges;
  }

  tick() {
    this.elapsedTime += 1;
    this.elapsedTimeInLane += 1;
  }
}

module.exports = Car;
