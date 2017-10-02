import looper from '../looper.js';

const assertNotCalled = value => {
  throw new Error(`This should not be called. Received ${value}.`);
};
const originalConsoleGroup = console.group;
const originalConsoleGroupEnd = console.groupEnd;
const noop = () => {
  return;
};

describe('looper', () => {
  let loop, cycle;

  // yanked from http://stackoverflow.com/questions/4959975/generate-random-value-between-two-numbers-in-javascript
  function randomFromInterval(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }

  beforeAll(() => {
    if (!console.group) {
      console.group = noop;
      console.groupEnd = noop;
    }
  });

  beforeEach(() => {
    cycle = [jest.fn(), jest.fn(), jest.fn()];
    loop = looper(cycle);
  });

  afterEach(jest.clearAllMocks);

  afterAll(() => {
    console.group = originalConsoleGroup;
    console.groupEnd = originalConsoleGroupEnd;
  });

  it('accepts a value, passed to the functions.', () => {
    expect.assertions(4);
    const addOne = jest.fn(n => n + 1);
    const addTwo = jest.fn(n => n + 2);
    loop = looper([addOne, addTwo]);
    loop.runs = 1;
    const assert = () => {
      expect(addOne).toHaveBeenCalledWith(11);
      expect(addOne).toHaveBeenCalledTimes(1);
      expect(addTwo).toHaveBeenCalledWith(12);
      expect(addTwo).toHaveBeenCalledTimes(1);
    };
    return loop(11).then(assert, assertNotCalled);
  });

  it('is a Promise of the final value.', () => {
    expect.assertions(1);
    const addOne = n => n + 1;
    loop = looper([addOne, addOne]);
    loop.runs = 40;
    return expect(loop(0)).resolves.toBe(80);
  });

  it('defaults to 27 runs.', () => {
    expect.assertions(4);
    const runs = 27;
    return loop().then(() => {
      expect(loop.runs).toBe(runs);
      expect(cycle[0]).toHaveBeenCalledTimes(runs);
      expect(cycle[1]).toHaveBeenCalledTimes(runs);
      expect(cycle[2]).toHaveBeenCalledTimes(runs);
    }, assertNotCalled);
  });

  it("should respect changes to runs property after the function's been composed.", () => {
    expect.assertions(3);
    loop.runs = 123;
    return loop().then(() => {
      expect(cycle[0]).toHaveBeenCalledTimes(loop.runs);
      expect(cycle[1]).toHaveBeenCalledTimes(loop.runs);
      expect(cycle[2]).toHaveBeenCalledTimes(loop.runs);
    }, assertNotCalled);
  });

  it('should console.log with a summary when finished.', () => {
    expect.assertions(1);
    jest.spyOn(console, 'log');
    const fixedRegExp = /^\d+\.\d$/;
    return loop().then(() => {
      expect(console.log).toHaveBeenCalledWith(
        '%s runs/s, %s functions/s',
        expect.stringMatching(fixedRegExp),
        expect.stringMatching(fixedRegExp)
      );
    }, assertNotCalled);
  });

  // Using functions that finish in a random duration,
  // assert that looper is able to finish all runs and report.
  it('supports async functions of varying duration.', () => {
    expect.assertions(3);
    const min = 0;
    const max = 20;
    const start = Date.now();

    function delay(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    }

    const random = value => {
      const ms = randomFromInterval(min, max);
      return delay(ms).then(() => value + 1);
    };
    const sequence = [random, random, random];
    loop = looper(sequence);
    loop.runs = 3;
    return loop(0).then(value => {
      const finish = Date.now();
      const difference = finish - start;
      expect(value).toBe(9); // runs * sequence.length
      expect(difference > 0).toBe(true);
      expect(difference <= 750).toBe(true); // max * runs * sequence.length
    }, assertNotCalled);
  });
});

describe('looper.clickElement()', () => {
  it('should be a Function', () => {
    expect.assertions(1);
    expect(typeof looper.clickElement).toBe('function');
  });
});

describe('looper.clickSelector()', () => {
  it('should be a Function', () => {
    expect.assertions(1);
    expect(typeof looper.clickSelector).toBe('function');
  });
});
