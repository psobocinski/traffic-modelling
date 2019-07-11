'use strict';

class Lane {
  constructor(cars = []) {
    this.cars = cars;
  }

  add(car) {
    this.cars.push(car);
  }
}

module.exports = Lane;
