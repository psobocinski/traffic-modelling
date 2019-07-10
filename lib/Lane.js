'use strict';

class Lane {
  constructor(name, cars = []) {
    this.name = name;
    this.cars = cars;
  }

  add(car) {
    this.cars.push(car);
  }
}

module.exports = Lane;
