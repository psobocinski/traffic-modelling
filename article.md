# Applying Game Theory to Traffic Modelling

Traffic congestion is a problem.

A study from last year found my home town Toronto to be the [20th most congested city in the world](http://inrix.com/scorecard-city/?city=Toronto%2C%20ON&index=20), with an average of 164 hours spent in congestion in 2018.

I am not surprised.

Early in my career, I commuted over an hour twice a day. In a year, that works out to roughly 21 days sitting in traffic. It feels particularly wasteful when I consider that I spent it driving. With transit, I can a least spend the time reading a book or catching up on news.

I have it a bit better these days (it takes me 10 minutes to walk to work). I still can't help but wonder how much time commuters could save if we reduced traffic congestion. In my case, even a 10% improvement could saved me a couple of days every year.

## How much time would we save if cars drove themselves?

It's easy to imagine how self-driving cars could save us time. As our car drives us to work, we'd be able to at least read that book we've been meaning to finish.

That benefit aside, however, let's consider actual time on the road. If we relinquished control to our artifically-intelligent automobiles, would we really end up spending less time in traffic?

More specifically, what if we rely on self-driving cars to place us in a lane of traffic (and keep us there), instead of using our own judgement to minimize our time in traffic, by changing lanes multiple times over the course of our commute?

The goal of this article is introduce an approach to answering this question quantitatively through the use of a simplified traffic model. In particular, the model aims to programmatically simulate traffic conditions and human behaviour.

Before exploring how self-driving cars can manage traffic better than we can, there is a more fundamental question we should answer.

## Is Opportunistic Lane-Changing a Zero-sum game?

It's a familiar struggle for regular commuters. The work meeting starts in half an hour, but the GPS is telling you that the ETA is in 36 minutes. Can you shave off those minutes with some clever, well-timed lane-changes?

If we haven't done it ourselves, we've been a witness to (and victim of) other drivers "weave" through traffic. Some of us feel that these drivers are only taking time off their commute and adding it onto us. In other words, such opportunistic lane-changing behaviour is a "zero-sum game".

But is it?

Wikipedia defines a zero-sum game as follows:

> In game theory and economic theory, a zero-sum game is a mathematical representation of a situation in which each participant's gain or loss of utility is exactly balanced by the losses or gains of the utility of the other participants.

In our case, we say that opportunistic lane-changing is a zero-sum game when such behaviour does not result in a better outcome for all commuters on the road (over a given time period).

If we can conclude a zero-sum game, we can also conclude that self-driving cars can manage traffic better than humans simply by _not changing lanes at all_.

## Assumptions and Definitions

In order to explore the "zero-sum game" hypothesis, we'll clarify some terms and define what to measure.

### Lane Change Conditions

Let's start with the notion of "opportunistic lane-changing". Here are two lane change conditions that seem reasonable:

1. The other lane appears to be moving a certain percentage faster than my current lane, AND
2. I have spent a certain minimum length of time in my current lane

To keep the model simple, we modify the first condition as follows:

- Changing to the other lane drops my remaining time in traffic by a given percentage

### Metrics

Second, we define what a "better outcome" means in our model. In particular, we define quantitative metrics such that lower values indicate the better outcome.

#### Aggregate and Average Time

The ideal length of time spent on the road is zero. Therefore, we define two metrics:

- **Average Time:** The average time spent by drivers on the road
- **Aggregate Time:** A total of every driver's time spent on the road

### Cars Remaining

Given that the following conditions remain the same for all simulation runs:

- number of cars entering the road
- simulation duration

We define an additional metric:

- **Cars Remaining:** The total number of cars remaining on the road at the end of the simulation

#### Aggregate Throughout

What if a simulation run results in a lower Aggregate Time, but a higher number of Cars Remaining? We define the following metric to account for this:

- **Aggregate Throughput:** `Aggregate Time / Cars Exited`

Unlike the prior metics, a higher value for this metric indicates the better outcome.

## Defining the Model

We model the total time on road for a given car to be solely dependent on the number of other cars in its lane:

`t[total] = f(n)`

   - `t[total]`: total time on road
   - `n`: number of cars in the given lane

Subsequently, a given car's remaining time on road `t[remaining]` is calculated as follows:

`t[remaining] = t[total] - t[elapsed]`

The elapsed time on road `t[elapsed]` is incremented as the simulation runs (more on this later). A car exits the road once `t[remaining]` reaches 0.

This approach avoids the need to track a car's position on the road, it simplifies the implementation of the model.

This assumption allows us to keep the model simple, as we avoid having to consider the cars' positions on the road.

### Time on Road Function

**[DIAGRAM GOES HERE]**

`t[total] = A * max(0, n - N) + M`

The graph above portrays a simplified yet reasonably possible time on road function. The time **M** represents the minimum length of time spent on road, regardless of the number of cars in a given lane. Similarly, **N** represents the "congestion-free" capacity of a lane of traffic. Once the number of cars grows beyond this number, the time on road increases proportionally to the number of cars in the lane. The number **A** represents the factor by which the time on road increases in response to one additional car on the road.

### Time Unit (tick)

Due to this being a programmatic model, we introduce the notion of a **tick**. This serves two main purposes:

- An arbitrary unit of time used in model
- The smallest progression step (or increment) in the simulation where a change can occur.

### Simluation Overview

**[DIAGRAM GOES HERE]**

The diagram above represents the general design of the simluation. The key concepts are:

- **Arrival Sequence:** A pre-generated sequence of boolean values based on an arrival probability
- **Lane Assigner:** If a car arrives, it is assigned to a lane at random
- **Lanes:** A number of **L** lanes that "contain" the cars. While there is no limit to the number of cars that can be placed in the lane, the total length of each car in the lane is subject to the *Time on Road function*
- **Car:** Decides whether or not to change lanes based on the *Lane Change Conditions*
- **Lane Exit:** Occurs for any car in any lane once **t[elapsed]** reaches **t[total]**
- **Metrics Tracker:** Tracks the metrics, as defined earlier

#### Behaviour on Tick

Here is what happens on every tick:

1. An value is popped off the Arrival Sequence
2. If there is an arrival, the Lane Assigner assigns it to a Lane
3. Cars who have met their Lane Change Conditions change Lanes
4. The time remaining is re-calculated for all Cars in all Lanes
5. Cars who have reached zero time remaining exit the road
6. Steps 4 and 5 are repeated until no more Cars exit the road

#### Input Conditions

Here are the input conditions that are common to all simulation runs (i.e. our controlled variables):

- **Arrival Probability:** For every tick, the likelihood of a car arriving. This value is close to 100% to simulate heavy traffic.
- **Duration:** How long to run the simulation for
- **Lane Change Delay:** If a car changes lanes, how much time is added to their total time in lane (in ticks). In other words, this is the time penalty for changing lanes
- **Time on Road Function:** As described earlier. Defined as an input condition so that we can improve it in the future
- **Lanes:** The number of lanes that the road is comprised of
- **Iterations:** The number of iterations to run the simulation for

Note that times are in ticks (as covered earlier).

Here are the input conditions that can be different for every simulation run (i.e. independent variables):

- **Lane Change Conditions:** if this is undefined, then no lane changes occur. If it is defined, the following values are set (as covered earlier):
  - **Minimum Time in Lane:** The minimum time spent in lane before a lane change is considered
  - **Minimum Time Saved Percentage:** The minimum time saved by changing lanes (as a percentage)

## Running the Simulations

Through trial and error, we determine an appropriate set of conditions. The ideal parameters should result in:

1. The number of cars in lane exceeds the congestion-free capacity most of the time: This ensures that actual traffic congestion is 
2. Most of the the cars that entered the road have exited it by the end of the simulation

As we are interested in observing the effects of traffic congestion, #1 is necessary. On the other hand, #2 ensures we are modelling a functional road that is serves its purpose of "carrying" traffic through it.

Based on the above, here are the Input Conditions that we have settled on:

```json
{
  "arrivalProbability": 0.9,
  "durationInTicks": 10000,
  "laneChangeDelayTicks": 1,
  "timeOnRoadFunction": "2 * Math.max(0, n - 5) + 20",
  "numberOfLanes": 3,
  "numberOfIterations": 3
}
```

### Experiment 1: Varying Lane Change Conditions

We change the two Lane Change Conditions independently, starting with Minimum Time in Lane.

#### Effect of changing Minimum Time in Lane

Keeping the Time Saved Percentage constant, we change the Minimum Time in Lane. Note that the first row represents the case where no lane change conditions occur.

| Min Time in Lane | Time Saved % | Avg Time | Cars Remain | Aggregate Time | Aggregate Throughput ( cars / 100 ticks) |
| ---------------- | ------------ | -------- | ----------- | -------------- | ---------------------------------------- |
| n/a | n/a | 26.3 | 15 | 236135 | 3.81 |
| 0 | 60 | 25.9 | 21 | 232877 | 3.86 |
| 4 | 60 | 24.1 | 17 | 216977 | 4.14 |
| 8 | 60 | 23.6 | 16 | 211796 | 4.24 |
| 12 | 60 | 22.7 | 16 | 204093 | 4.4 |
| 16 | 60 | 22.5 | 17 | 201838 | 4.45 |
| 20 | 60 | 22.2 | 15 | 199707 | 4.5 |
| 24 | 60 | 22.6 | 16 | 202745 | 4.43 |

All results perform better than the no-lane-change case. also, there is an optimal value for Min Time in Lane (that yields the maximum throughput) around a Min Time in Lane of 20 ticks.

#### Effect of changing Time Saved Percentage

Now, we change the Mininum Time in Lane, while keeping Time Saved Percentage constant.

| Min Time in Lane | Time Saved % | Avg Time | Cars Remain | Aggregate Time | Aggregate Throughput ( cars / 100 ticks) |
| ---------------- | ------------ | -------- | ----------- | -------------- | ---------------------------------------- |
| n/a | n/a | 25.9 | 24 | 233837 | 3.85 |
| 3 | 30 | 28.7 | 26 | 258991 | 3.48 |
| 3 | 60 | 24.3 | 19 | 219160 | 4.11 |
| 3 | 90 | 22.6 | 19 | 203798 | 4.42 |
| 3 | 120 | 22.2 | 20 | 200388 | 4.5 |
| 3 | 150 | 22 | 21 | 198475 | 4.54 |
| 3 | 180 | 22 | 17 | 197931 | 4.55 |
| 3 | 210 | 22 | 21 | 198392 | 4.54 |

We can see the second result performs worse than the no-lane-changes case. Also, the model yields a better outcome as the "Time Saved Percentage" lane change condition is increased, until the value reaches 210%. At this point, the throughput and the other metrics (average time, cars remaining, and aggregate time) start to creep up.

#### Conclusion

The data yields three key conclusions:

1. Depending on the specific values, opportunistic lane changing can yield either a better or worse outcome than no lane changing 
2. There is an optimal set of opportunistic lane change conditions that yield the best outcome possible
3. Opportunitistic lane changing can yield a significantly better outcome than no lane changing (18% better in the above case)



### Experiment 2: Varying Lane Change Delay

F

