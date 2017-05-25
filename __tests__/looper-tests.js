import looper from "../looper.js";
import sinon from "sinon";

const assertNotCalled = value => {
  throw new Error(`This should not be called. Received ${value}.`);
};

describe("looper", function() {
  let loop, cycle;
  let sandbox;

  // yanked from http://stackoverflow.com/questions/4959975/generate-random-value-between-two-numbers-in-javascript
  function randomFromInterval(from, to) {
    return Math.floor(Math.random() * (to - from + 1) + from);
  }

  beforeEach(function() {
    sandbox = sinon.sandbox.create();
    cycle = [sandbox.stub(), sandbox.stub(), sandbox.stub()];
    loop = looper(cycle);
  });

  afterEach(function() {
    sandbox.restore();
  });

  it("accepts a value, passed to the functions.", function() {
    let addOne = sandbox.spy(function(n) {
      return n + 1;
    });
    let addTwo = sandbox.spy(function(n) {
      return n + 2;
    });
    loop = looper([addOne, addTwo]);
    loop.runs = 1;
    const assert = function() {
      sinon.assert.calledWith(addOne, 11);
      sinon.assert.calledWith(addTwo, 12);
    };
    return loop(11).then(assert, assertNotCalled);
  });

  it("is a promise of the final value.", function() {
    let addOne = function(n) {
      return n + 1;
    };
    loop = looper([addOne, addOne]);
    loop.runs = 40;
    return loop(0).then(function(n) {
      expect(n).toBe(80);
    }, assertNotCalled);
  });

  it("defaults to 27 runs.", function() {
    let runs = 27;
    return loop().then(function() {
      expect(loop.runs).toBe(runs);
      sinon.assert.callCount(cycle[0], runs);
      sinon.assert.callCount(cycle[1], runs);
      sinon.assert.callCount(cycle[2], runs);
    }, assertNotCalled);
  });

  it("should respect changes to runs property after the function's been composed.", function() {
    loop.runs = 123;
    return loop().then(function() {
      sinon.assert.callCount(cycle[0], 123);
      sinon.assert.callCount(cycle[1], 123);
      sinon.assert.callCount(cycle[2], 123);
    }, assertNotCalled);
  });

  it("should console.log with a summary when finished.", function() {
    sandbox.spy(console, "log");
    let fixedRegExp = /^\d+\.\d$/;
    return loop().then(function() {
      sinon.assert.calledWithMatch(
        console.log,
        "%s runs/s, %s functions/s",
        fixedRegExp,
        fixedRegExp
      );
    }, assertNotCalled);
  });

  // Using functions that finish in a random duration,
  // assert that looper is able to finish all runs and report.
  it("supports async functions of varying duration.", function() {
    let min = 0;
    let max = 200;
    let start = Date.now();

    function delay(ms) {
      return new Promise(function(resolve) {
        setTimeout(resolve, ms);
      });
    }

    let random = function(value) {
      let ms = randomFromInterval(min, max);
      return delay(ms).then(function() {
        return value + 1;
      });
    };
    let sequence = [random, random, random];
    loop = looper(sequence);
    loop.runs = 3;
    return loop(0).then(function(value) {
      let finish = Date.now();
      let difference = finish - start;
      expect(value).toBe(9); // runs * sequence.length
      expect(difference < 7500).toBe(true); // max * runs * sequence.length
    }, assertNotCalled);
  });
});

describe("looper.click()", function() {
  let sandbox;
  beforeEach(function() {
    sandbox = sinon.sandbox.create();
  });
  afterEach(function() {
    sandbox.restore();
  });
  describe("returned composed function", function() {
    it("returns a promise that resolves ~50ms after the element's clicked.", function() {
      let handler = sandbox.spy();
      let click = looper.click(document.body);
      let start = Date.now();
      document.body.addEventListener("click", handler);
      return click().then(function() {
        let now = Date.now();
        expect(now - start > 50).toBe(true);
        sinon.assert.calledOnce(handler);
      }, assertNotCalled);
    });
  });
});
