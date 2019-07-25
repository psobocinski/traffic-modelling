[![Build Status](https://travis-ci.com/psobocinski/traffic-modelling.svg?branch=master)](https://travis-ci.com/psobocinski/traffic-modelling)

# Traffic Modelling

A simple computer model for simulating traffic congestion.

## Quickstart

1. Install dependencies: `npm install`
2. Generate configuration files: `npm run configure`
3. Run simulation: `npm run simulate`

## Overview

For an overview of the computer model and how it can be used, please see this article [investigating whether lane changing in traffic is a zero-sum game](# "Link to article goes here").

## Configuring the model

`npm run configure` generates two configuration files:

### 1. Common Configuration: `config/common.json`

Copied from the sample file: `config/common.sample.json`. Contains the following fields:

1. `arrivalProbability`: Likelihood a car arrives on the next tick
1. `durationInTicks`: How long each simulation runs for
1. `numberOfIterations`: The number of times (iterations) each configured simulation is run. The result takes an average of all iterations
1. `simulationDefaults`: The values of the Independent Variables used in all simulations, unless they are overridden in the simulation configuration
   1. `laneChangeDelayTicks`: The time added to the Total Time in Lane upon a lane change
   1. `lanePlacement`: How each Car is assigned to a Lane (`levelled` or `random`)
   1. `minTicksInLane`: The minimum time in Lane until Car considers switching Lanes
   1. `minTickSpeedupPercent`: The minimum time saved by switching Lanes for Car to consider switching Lanes
   1. `numberOfLanes`: The number of lanes (minimum 2)
   1. `timeOnRoadFunction`: The function `t = f(n)` used to calculate total time on road `t`. Based on `n`, the number of Cars in lane.
1. `output`: Configuration for how simulation output is written
   1. `format`: File format (`markdown` or `csv`).
   1. `path`: File path (filename will be `results`).
   1. `columns`: Columns to include in results. Array of tuples. First entry is the variable name, the second is the column header used. Examples:
      - `[ "minTicksInLane", "Min Time in Lane" ]`
      - `[ "overallThroughput", "Aggregate Throughput (cars / 100 ticks)" ]`

### 2. Simulation-specific Configuration: `config/simulations.json`

Contains configurations for every simulation, where one or more Independent Variables can be overridden.
This file is auto-generated by prompting the user, varying one Independent Variable at a time.
Additional simulations can be added by editing this file directly (prior to running `npm run simulate`).

## Running the simulation

`npm run simulate` runs the simulation and outputs debug data to the console.
It also generates the results and writes them to the path and format as specified in the common configuration.

### Traffic Performance Metrics

The following can be included in the results file by adding them to the common configuration (under `output.columns`):

- `simulationTime`: Elapsed time of simulation
- `carsEntered`: Total number of cars entered over the course of the simulation
- `carsRemaining`: Cars remaining on the road at the end of the simulation
- `averageTimeOnRoad`: Average time spent on the road by all cars
- `carsOnRoadAggregateTime`: Total of all times spent by all cars on the road
- `totalLaneChanges`: Total number of lane changes that occurred
- `overallThroughput`: Measures traffic performance.
  - `Aggregate Throughput (cars / 100 ticks) = Total Cars Exited / Aggregate Time * 100`
- `averageThroughput`: Same as above, except that it is calculated per tick, then averaged

## Development

- Run tests while you code: `npm run specs -- --watch`
- Run ESLint and all tests: `npm test`
  - NOTE: also runs in Travis CI
- Run ESLint on its own: `npm run lint`
  - NOTE: not recommended, instead configure your IDE to use the project's ESLint configuration
