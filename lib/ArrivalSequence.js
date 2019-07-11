'use strict';

class ArrivalSequence {
  constructor({ durationInTicks, arrivalProbability }) {
    this.durationInTicks = durationInTicks;
    this.arrivalProbability = arrivalProbability;
  }

  isArrival() {
    return Math.random() < this.arrivalProbability
  }

  generate() {
    let arrivalSequence = [];

    for (let i = 0; i < this.durationInTicks; i++) {
      if (this.isArrival())
        arrivalSequence.push(true);
      else
        arrivalSequence.push(false);
    }

    return arrivalSequence;
  }
}

module.exports = ArrivalSequence;
