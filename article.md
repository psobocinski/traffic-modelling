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

Let's start with the notion of "opportunistic lane-changing". The term "opportunistic" is used to indicate that the driver will act opportunistically for their own self interest, i.e. they will not consider the effects of their actions on other drivers.

In light of this, here are two lane change conditions that seem reasonable:

"As a driver, I will change lanes if all of the following conditions are met:"

1. Changing to the other lane drops my remaining time in traffic by a certain percentage
2. I have spent a certain minimum length of time in my current lane

### Traffic Performance Metrics

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
  "laneChangeDelayTicks": 5,
  "timeOnRoadFunction": "2 * Math.max(0, n - 5) + 20",
  "numberOfLanes": 3,
  "numberOfIterations": 3
}
```

### Results of Varying Lane Change Conditions on Traffic Performance

We change the two Lane Change Conditions independently, starting with Minimum Time in Lane.

#### Part A: Effect of changing Minimum Time in Lane

Keeping the Time Saved Percentage constant, we change the Minimum Time in Lane. Note that the first row represents the case where no lane change conditions occur.

| Min Time in Lane | Time Saved % | Avg Time | Cars Remain | Aggregate Time | Aggregate Throughput ( cars / 100 ticks) |
| ---------------- | ------------ | -------- | ----------- | -------------- | ---------------------------------------- |
| n/a | n/a | 26.5 | 19 | 238586 | 3.77 |
| 0 | 60 | 51.9 | 74 | 467290 | 1.93 |
| 5 | 60 | 36.8 | 23 | 330752 | 2.72 |
| 10 | 60 | 27.2 | 45 | 244972 | 3.68 |
| 15 | 60 | 25.1 | 19 | 225633 | 3.99 |
| 20 | 60 | 24.6 | 19 | 221734 | 4.06 |
| 25 | 60 | 24.2 | 21 | 218049 | 4.13 |
| 30 | 60 | 24.7 | 22 | 222337 | 4.05 |
| 99999999 | 60 | 26.5 | 19 | 238777 | 3.77 |

Given that we set the "Time Saved %" lane change condition constant at 60%, the model yields an optimum result at a Min Time in Lane of around 25 ticks. Also note that at lower values, it performs worse than the no-lane-changes case.

#### Part B: Effect of changing Time Saved Percentage

Now, we change the Mininum Time in Lane, while keeping Time Saved Percentage constant.

| Min Time in Lane | Time Saved % | Avg Time | Cars Remain | Aggregate Time | Aggregate Throughput ( cars / 100 ticks) |
| ---------------- | ------------ | -------- | ----------- | -------------- | ---------------------------------------- |
| n/a | n/a | 26.6 | 24 | 240121 | 3.76 |
| 2 | 30 | 56.2 | 83 | 507291 | 1.78 |
| 2 | 60 | 35.2 | 55 | 317806 | 2.84 |
| 2 | 90 | 25.1 | 26 | 226751 | 3.98 |
| 2 | 120 | 24.5 | 29 | 221222 | 4.08 |
| 2 | 150 | 24.3 | 25 | 219458 | 4.12 |
| 2 | 180 | 24.3 | 28 | 219550 | 4.11 |
| 2 | 210 | 24.2 | 21 | 218634 | 4.13 |
| 2 | 99999999 | 24.2 | 21 | 218670 | 4.13 |

Similar to Part A, the simulation performs worse than the no-ane-changes case at lower values of "Time Saved %". Also, the simulation yields a better outcome as the "Time Saved Percentage" lane change condition is increased. The gains begin to taper off at 210% and a throughput of 4.15. (*)

(*) Lane changes occur even at a very high "Time Saved %" threshold, because a lane change will always occur when the time remaining in the new lane is zero.

### Conclusion

The results yield three key conclusions:

1. Depending on input or lane change conditions, opportunistic lane changing can yield either a better or worse outcome than no lane changing 
2. There is an optimal combination of opportunistic lane change conditions that yield the best outcome possible
3. Opportunistic lane changing can yield a significantly better outcome than no lane changing (~10%). Further simulation runs can determine a combined optimum for both lane change conditions that potentially yields an even better improvement than identified here.

If opportunistic lane changes in congested traffic were a zero-sum game, we would yield the same set of metrics for all simulation runs. Instead, we discovered that opportunistic lane changing to be both less performant and more performant than no lane changing.

Furthermore, a net-positive result for all drivers seems reasonably achievable, even while pursuing an opportunistic approach (specifically, the one we described here).

Therefore, we can conclude that generally speaking, **opportunistic lane changing is not a zero-sum gain**, and can benefit all drivers on the road if exercised judiciously. This means not changing lanes too frequently (i.e. adhering to a reasonable minimum time in lane), and only changing lanes if it saves a signicant amount of time (i.e. the time saved is 90% or higher).

#### Future Improvements

Experienced drivers will likely not find this conclusion surprising. The benefit of having this model is that statistical data could be applied, which would give a more concrete optimum range given varying conditions that we held constant (for example, number of lanes).

Also, we have not had the change to fully explore the hypothetical potential of self-driving cars. A random lane assignment with no lane changes will inevitably lead to imbalanced lanes. A valuable avenue to explore is how a lane-levelling algorithm competes against the opportunistic lane changing behaviour we have explored here. We hope to pursue this in the next part of this blog post.






