const root = '../../../',
  Road = require(`${root}lib/Road`),
  greedy = require(`${root}lib/behaviours/greedy`);

describe('greedy', () => {
  let noop = () => null, mockRoad;

  beforeEach(() => {
    mockRoad = new Road(noop, {tick: noop});
  });

  describe('processing arrival sequence', () => {
    it('ticks on every sequence element', () => {
      mockRoad.tick = jest.fn();

      greedy([false, true], mockRoad);

      expect(mockRoad.tick).toHaveBeenCalledTimes(2);
    });

    it('adds car when one arrives', () => {
      mockRoad.addCar = jest.fn();

      greedy([true], mockRoad);

      expect(mockRoad.addCar).toHaveBeenCalled();
    });

    it('does not add car when does not arrive', () => {
      mockRoad.addCar = jest.fn();

      greedy([false], mockRoad);

      expect(mockRoad.addCar).not.toHaveBeenCalled();
    });
  });

  describe('choosing lane', () => {
    it('adds car to shortest lane', () => {
      mockRoad.addCar(1);

      greedy([true], mockRoad);

      expect(mockRoad.lanes[0].cars).toHaveLength(1);
      expect(mockRoad.lanes[1].cars).toHaveLength(1);
    });

    it('adds car to left lane when lanes have equal length', () => {
      mockRoad.addCar(0);
      mockRoad.addCar(1);

      greedy([true], mockRoad);

      expect(mockRoad.lanes[0].cars).toHaveLength(2);
      expect(mockRoad.lanes[1].cars).toHaveLength(1);
    })
  })
});
