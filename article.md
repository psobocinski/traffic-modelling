# Applying Game Theory to Traffic Modelling

Traffic is a problem.

A recent study Toronto (my home town) to be the [worst city for commuting in North America](https://www.reddit.com/r/toronto/comments/cblipd/toronto_is_the_6th_worst_city_in_the_world_for/).

I am not surprised.

Early in my career, I commuted over an hour twice a day. In a year, that works out to roughly 21 days that I will never get back. This feels particularly wasteful when it's spent driving a car -- with transit, you may be able to spend the time reading a book.

Fortunately, I have it considerably better these days (it takes me 10 minutes to walk to work). However, I can't help but wonder if one of those 21 days could be "recovered" for future commuters if we optimized the process.

## How much time would we save if cars drove themselves?

It's hard to argue that self-driving cars would not save us time. We'd be able to at least read that book we've been meaning to finish (as the car drives us to our destination).

However, what about actual time on the road? If we relinquished control to our artifically-intelligent automobiles, would we really end up spending less time in traffic?

The goal of this article is introduce an approach to answering this question quantitatively through the use of a simplified traffic model. In particular, the model will programmatically simulate both traffic conditions, as well as rational human behaviour.

## Is "Beating Traffic" a Zero-sum game?

It's a familiar struggle for regular commuters. The work meeting starts in half an hour, but the GPS is telling you that the ETA is in 36 minutes. Can you shave off those minutes with some clever, well-timed lane-changes?

Conversely, we've witnessed such driving behaviour and for good reason, we frown upon those who "weave" through traffic. We feel that these drivers are only taking time away from us by slowing us down. In other words, we thing of "beating traffic" (i.e. opportunistically attempting to reduce our time in it) as a zero-sum game.

But is it?

Wikipedia defines a zero-sum game as follows:

> In game theory and economic theory, a zero-sum game is a mathematical representation of a situation in which each participant's gain or loss of utility is exactly balanced by the losses or gains of the utility of the other participants.

In our case, we say that "beating traffic" through changing lanes is a zero-sum game when such behaviour does not result in a net positive result for all commuters on the road (over a given time period).

Our traffic model will explore the above hypothesis.  

## Assumptions and Definitions

### Lane Change Conditions

Let's start with the notion of "beating traffic" by changing lanes. Here are two lane change conditions that seem reasonable to me (drawing on my past experience as a commuter):

1. The other lane appears to be moving X% faster than my current lane, AND
2. I have spent a certain minimum time in my current lane

Further, to keep the model simple, I will modify the first condition as follows: 
   - Changing to the other lane drops my remaining time in traffic by X%

### Measuring Results

Second, we define what a "net positive result" means in our model.
