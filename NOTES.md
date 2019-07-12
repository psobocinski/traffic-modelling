
## I. Calculating time on road

number of lanes = 2

time on road: `t = f(n)`, where:
   - `n`: number of vehicles in current lane (variable, used by simulation)

Possible time on road functions:
   - Linear: `A * Math.max(0, n - N) + M`
   - Quadratic: `A * Math.pow(Math.max(0, n - N), 2) + M`

Note that the constants `A, M, and N` must be replaced with non-zero numeric values prior to running the simulation.
The constant `M` and `N` have special meaning:
   - `M` is the minimum amount of time in the lane;
   - `N` is the max number of cars where a constant time `M` is spent in the lane
represents the minimum amount of time in lane (even when empty).

Example function definitions:
   - Linear: `2 * Math.max(0, n - 5) + 20`
   - Quadratic: `0.5 * Math.pow(Math.max(0, n - 5), 2) + 20`

## II. Behaviour Modelling

### 1. Random

- Car is placed in a lane at random
- No lane changes occur.

### 2. Auto-levelling

- Car is placed in whichever lane results in the smallest difference in cars between lanes
- No lane changes occur.

### 3. Greedy drivers

1. Lane is changed when:
   - Minimum time t(ticks) spent in lane, AND
   - Remaining time in lane has increased beyond a minimum percentage
1. New car then enters lane with lowest number of cars ("levelled" approach)

TODO: allow switching between levelled and random approach for car arrival via config.

## Recalculating remaining time on road

Whenever number of cars in lane changes, the time remaining for every car is recalculated as follows:

t(remaining) = Min\[t(recalculated) - t(elapsed), 0\]

where t(recalculated) uses the original formula in section I.

## On tick

The 'tick' represents the smallest modelled unit of time. On every tick, the following occurs:

1. The length of elapsed time for all cars on the road is incremented by 1
2. The remaining time is recalculated. If equal to or less than 0, those cars are removed from the road
3. Repeat step 2 until there are no cars removed from the road
4. Calculate throughput metric for steps 2 to 3

## Output metrics

1. Throughput per tick = N / T
- N is total number of vehicles exited on that tick.
- T is total time spent on road by all vehicles that exited on that tick.
2. Average throughput per tick = average of all throughputs per tick for the length of the simulation
3. Total throughput = Σ(N) / Σ(T) for the length of the simulation
