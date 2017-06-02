import looper from '../index.js';
import sinon from 'sinon';

const assertNotCalled = value => {
  throw new Error(`This should not be called. Received ${value}.`);
};
const originalConsoleGroup = console.group;
const noop = () => {
  return;
};

describe('looper', () => {
  let loop, cycle;
  let sandbox;

  // yanked from http://stackoverflow.com/questions/4959975/generate-random-value-between-two-numbers-in-javascript
  function randomFromInterval(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }

  beforeEach(() => {
    sandbox = sinon.sandbox.create();
    cycle = [sandbox.stub(), sandbox.stub(), sandbox.stub()];
    loop = looper(cycle);
    if (!console.group) {
      console.group = noop;
      console.groupEnd = noop;
    }
  });

  afterEach(() => {
    sandbox.restore();
    console.group = originalConsoleGroup;
  });

  it('accepts a value, passed to the functions.', () => {
    const addOne = sandbox.spy(n => n + 1);
    const addTwo = sandbox.spy(n => n + 2);
    loop = looper([addOne, addTwo]);
    loop.runs = 1;
    const assert = () => {
      sinon.assert.calledWith(addOne, 11);
      sinon.assert.calledWith(addTwo, 12);
    };
    return loop(11).then(assert, assertNotCalled);
  });

  it('is a Promise of the final value.', () => {
    const addOne = n => n + 1;
    loop = looper([addOne, addOne]);
    loop.runs = 40;
    return expect(loop(0)).resolves.toBe(80);
  });

  it('defaults to 27 runs.', () => {
    const runs = 27;
    return loop().then(() => {
      expect(loop.runs).toBe(runs);
      sinon.assert.callCount(cycle[0], runs);
      sinon.assert.callCount(cycle[1], runs);
      sinon.assert.callCount(cycle[2], runs);
    }, assertNotCalled);
  });

  it("should respect changes to runs property after the function's been composed.", () => {
    loop.runs = 123;
    return loop().then(() => {
      sinon.assert.callCount(cycle[0], 123);
      sinon.assert.callCount(cycle[1], 123);
      sinon.assert.callCount(cycle[2], 123);
    }, assertNotCalled);
  });

  it('should console.log with a summary when finished.', () => {
    sandbox.spy(console, 'log');
    const fixedRegExp = /^\d+\.\d$/;
    return loop().then(() => {
      sinon.assert.calledWithMatch(
        console.log,
        '%s runs/s, %s functions/s',
        fixedRegExp,
        fixedRegExp
      );
    }, assertNotCalled);
  });

  // Using functions that finish in a random duration,
  // assert that looper is able to finish all runs and report.
  it('supports async functions of varying duration.', () => {
    const min = 0;
    const max = 200;
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
      expect(difference < 7500).toBe(true); // max * runs * sequence.length
    }, assertNotCalled);
  });
});

describe('looper.click()', () => {
  it('should be a Function', () => {
    expect(looper.click).toBeInstanceOf(Function);
  });
});

describe('looper.clickSelector()', () => {
  it('should be a Function', () => {
    expect(looper.clickSelector).toBeInstanceOf(Function);
  });
});
