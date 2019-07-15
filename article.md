# Applying Game Theory to Traffic Modelling

Traffic congestion is a problem.

A study from last year concludes Toronto (my home town) to be the [20th most congested city in the world](http://inrix.com/scorecard-city/?city=Toronto%2C%20ON&index=20), with an average of 164 hours spent in congestion in 2018.

I am not surprised.

Early in my career, I commuted over an hour twice a day. In a year, that works out to roughly 21 days sitting in traffic. It feels particularly wasteful when I consider that I spent it driving. With transit, I can a least spend the time reading a book or catching up on news.

Fortunately, I have it a bit better these days (it takes me 10 minutes to walk to work). However, I can't help but wonder how much time commuters could save if we reduced traffic congestion. In my case, even a 10% improvement could saved me a couple of days every year.

## How much time would we save if cars drove themselves?

It's easy to imagine how self-driving cars could save us time. As our car drives us to work, we'd be able to at least read that book we've been meaning to finish.

That benefit aside, however, let's consider actual time on the road. If we relinquished control to our artifically-intelligent automobiles, would we really end up spending less time in traffic?

More specifically, what if we rely on self-driving cars to place us in a lane of traffic (and keep us there), instead of using our own judgement to minimize our time in traffic, by changing lanes multiple times over the course of our commute?

The goal of this article is introduce an approach to answering this question quantitatively through the use of a simplified traffic model. In particular, the model aims to programmatically simulate traffic conditions and human behaviour.

Before exploring how self-driving cars can manage traffic better than we can, however, there's a preliminary question we should answer.

## Is Opportunistic Lane-Changing a Zero-sum game?

It's a familiar struggle for regular commuters. The work meeting starts in half an hour, but the GPS is telling you that the ETA is in 36 minutes. Can you shave off those minutes with some clever, well-timed lane-changes?

If we haven't done it ourselves, we've been a witness to (and victim of) other drivers "weave" through traffic. Some of us feel that these drivers are only taking time off their commute and adding it onto us. In other words, such opportunistic lane-changing behaviour is a "zero-sum game".

But is it?

Wikipedia defines a zero-sum game as follows:

> In game theory and economic theory, a zero-sum game is a mathematical representation of a situation in which each participant's gain or loss of utility is exactly balanced by the losses or gains of the utility of the other participants.

In our case, we say that opportunistic lane-changing is a zero-sum game when such behaviour does not result in a better outcome for all commuters on the road (over a given time period).

Our traffic model will explore the above hypothesis.  

## Assumptions and Definitions

### Lane Change Conditions

Let's start with the notion of "opportunistic lane-changing". Here are two lane change conditions that seem reasonable to me (drawing on my past experience as a commuter):

1. The other lane appears to be moving a certain percentage faster than my current lane, AND
2. I have spent a certain minimum length of time in my current lane

To keep the model simple, I will modify the first condition as follows:

- Changing to the other lane drops my remaining time in traffic by a given percentage

### Metrics

Second, we define what a "better outcome" means in our model. In particular, we define quantitative metrics such that lower values indicate the better outcome.

#### Aggregate and Average Time

The ideal length of time spent on the road is zero. Therefore, we define two metrics:

- **Aggregate Time:** A total of every driver's time spent on the road
- **Average Time:** The average time spent by drivers on the road

### Cars Remaining

Given we set the following conditions the same for all simulation runs:

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

Due to this being a programmatic model, we introduce the notion of the tick. This serves two main purposes:

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




