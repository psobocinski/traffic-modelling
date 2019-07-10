const root = '../../../',
      Road = require(`${root}lib/Road`),
      levelled = require(`${root}lib/behaviours/levelled`);

describe('levelled', () => {
  let noop = () => null, mockRoad;

  beforeEach(() => {
    mockRoad = new Road(noop, {tick: noop});
  });

  describe('processing arrival sequence', () => {
    it('ticks on every sequence element', () => {
      mockRoad.tick = jest.fn();

      levelled([false, true], mockRoad);

      expect(mockRoad.tick).toHaveBeenCalledTimes(2);
    });

    it('adds car when one arrives', () => {
      mockRoad.addCar = jest.fn();

      levelled([true], mockRoad);

      expect(mockRoad.addCar).toHaveBeenCalled();
    });

    it('does not add car when does not arrive', () => {
      mockRoad.addCar = jest.fn();

      levelled([false], mockRoad);

      expect(mockRoad.addCar).not.toHaveBeenCalled();
    });
  });

  describe('choosing lane', () => {
    const carsForLane = laneName => mockRoad.lanes.find(lane => lane.name === laneName).cars;

    it('adds car to shortest lane', () => {
      mockRoad.addCar('left');

      levelled([true], mockRoad);

      expect(carsForLane('left')).toHaveLength(1);
      expect(carsForLane('right')).toHaveLength(1);
    });

    it('adds car to left lane when lanes have equal length', () => {
      mockRoad.addCar('left');
      mockRoad.addCar('right');

      levelled([true], mockRoad);

      expect(carsForLane('left')).toHaveLength(2);
      expect(carsForLane('right')).toHaveLength(1);
    })
  })
});
