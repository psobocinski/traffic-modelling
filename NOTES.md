
## I. Calculating time on road

number of lanes = 2

time on road = t, where n: number of vehicles in current lane and A, B: constants

Linear: t = A*n, OR
Exponential: t = A*B^(n-1), OR
Logarithmic: t = A*log(B)(n)

## II. Behaviour Modelling

### 1. Random

- Car is placed in a lane at random
- If lane is at max capacity, then wait until next tick
- No lane changes occur.

### 2. Auto-levelling

- Car is placed in whichever lane results in the smallest difference in car between lanes
- If both lanes are at max capacity, then wait until next tick 

### 3. Greedy drivers

Lane is changed when:

- Car initially enters a lane at random
- Lane has not reached maximum capacity, AND
- Minimum time t(ticks) spent in lane, AND:
- Changing to adjacent lane reduces apparent time in traffic reduced by Y%, OR:
   - adjacent lane moving X times faster than current lane (TBD: whichever logic is simpler)

Time taken for lane change: t(lane-change)

## Recalculating remaining time on road

Whenever number of cars in lane changes, the time remaining for every car is recalculated as follows:

t(remaining) = |t(recalculated) - t(elapsed)|

where t(recalculated) uses the original formula in section I.

## On tick

The 'tick' represents the smallest modelled unit of time. On every tick, the following occurs:

1. The length of elapsed time for all cars on the road is incremented by 1
2. The remaining time is recalculated. If equal to or less than 0, those cars are removed from the road
3. Current throughput metric is calculated for the "tick" on 2.
4. 

## Output metrics

1. Throughput per tick = N / T
- N is total number of vehicles exited on that tick.
- T is total time spent on road by all vehicles that exited on that tick.
2. Average throughput per tick = average of all throughputs per tick for the length of the simulation
3. Total throughput = sigma(N) / sigma(T) for the length of the simulation
