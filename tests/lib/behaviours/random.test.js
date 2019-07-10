const root = '../../../',
      Road = require(`${root}lib/Road`),
      random = require(`${root}lib/behaviours/random`);

describe('random', () => {
  let noop = () => null,
      mockRoad = new Road(noop, {tick: noop});

  describe('processing arrival sequence', () => {
    it('ticks on every sequence element', () => {
      mockRoad.tick = jest.fn();

      random([false, true], mockRoad);

      expect(mockRoad.tick).toHaveBeenCalledTimes(2);
    });

    it('adds car when one arrives', () => {
      mockRoad.addCar = jest.fn();

      random([true], mockRoad);

      expect(mockRoad.addCar).toHaveBeenCalled();
    });

    it('does not add car when does not arrive', () => {
      mockRoad.addCar = jest.fn();

      random([false], mockRoad);

      expect(mockRoad.addCar).not.toHaveBeenCalled();
    });
  });
});
