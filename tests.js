describe('looper', function(){
  var loop, cycle;
  var sandbox;

  // yanked from http://stackoverflow.com/questions/4959975/generate-random-value-between-two-numbers-in-javascript
  function randomFromInterval(from,to) {
    return Math.floor(Math.random()*(to-from+1)+from);
  }

  beforeEach(function(){
    sandbox = sinon.sandbox.create();
    cycle = [sandbox.stub(), sandbox.stub(), sandbox.stub()];
    loop = looper(cycle);
  });

  afterEach(function(){
    sandbox.restore();
  });

  it('accepts a value, passed to the functions.', function(done){
    var addOne = sandbox.spy(function(n){ return n + 1; });
    var addTwo = sandbox.spy(function(n){ return n + 2; });
    loop = looper([addOne, addTwo]);
    loop.runs = 1;
    loop(11).then(function(){
      sinon.assert.calledWith(addOne, 11);
      sinon.assert.calledWith(addTwo, 12);
      done();
    });
  });

  it('is a promise of the final value.', function(done){
    var addOne = function(n){ return n + 1; };
    loop = looper([addOne, addOne]);
    loop.runs = 40;
    loop(0).then(function(n){
      expect(n).to.be(80);
      done();
    });
  });

  it('defaults to 27 runs.', function(done){
    var runs = 27;
    loop().then(function(){
      expect(loop.runs).to.be(runs);
      sinon.assert.callCount(cycle[0], runs);
      sinon.assert.callCount(cycle[1], runs);
      sinon.assert.callCount(cycle[2], runs);
      done();
    });
  });

  it("should respect changes to runs property after the function's been composed.", function(done){
    loop.runs = 123;
    loop().then(function(){
      sinon.assert.callCount(cycle[0], 123);
      sinon.assert.callCount(cycle[1], 123);
      sinon.assert.callCount(cycle[2], 123);
      done();
    });
  });

  it('should console.log with a summary when finished.', function(done){
    sandbox.spy(console, 'log');
    var fixedRegExp = /^\d+\.\d$/;
    loop().then(function(){
      sinon.assert.calledWithMatch(console.log, '%s runs/s, %s functions/s', fixedRegExp, fixedRegExp);
      done();
    });
  });

  // Using functions that finish in a random duration,
  // assert that looper is able to finish all runs and report.
  it('supports async functions of varying duration.', function(done){
    this.timeout(8000);
    var min = 0;
    var max = 500;
    var start = Date.now();

    function delay(ms){
      return new Promise(function(resolve){
        setTimeout(resolve, ms);
      });
    }

    var random = function(value){
      var ms = randomFromInterval(min, max);
      return delay(ms).then(function(){
        return value + 1;
      });
    };
    var sequence = [random, random, random];
    loop = looper(sequence);
    loop.runs = 5;
    loop(0).then(function(value){
      var finish = Date.now();
      var difference = finish - start;
      expect(value).to.be(15);// runs * sequence.length
      expect(difference).to.be.lessThan(7500);// max * runs * sequence.length
      done();
    });
  });

});

describe("looper.click()", function(){
  var sandbox;
  beforeEach(function(){
    sandbox = sinon.sandbox.create();
  });
  afterEach(function(){
    sandbox.restore();
  });
  describe('returned composed function', function(){
    it("returns a promise that resolves ~50ms after the element's clicked.", function(done){
      var handler = sandbox.spy();
      var click = looper.click('body');
      var start = Date.now();
      $('body').on('click', handler);
      click().then(function(){
        var now = Date.now();
        expect(now - start).to.be.greaterThan(50);
        sinon.assert.calledOnce(handler);
        done();
      });
    });
  });
});

describe("looper.sequencer()", function(){
    var sandbox;
    beforeEach(function(){
        sandbox = sinon.sandbox.create();
    });
    afterEach(function(){
        sandbox.restore();
    });
    it("returns a promise that resolves after N iterations * `delay`", function(done){
        var callback = sandbox.spy(),
            start = Date.now(),
            delay = 50,
            sequence = [1,2,3],
            N = sequence.length,
            totalTime = delay * N,
            seq = looper.sequencer(sequence, callback, delay);

        seq.then(function(){
            var now = Date.now();
            expect(now-start).to.be.greaterThan(totalTime);
            sinon.assert.callCount(callback, N);
            done();
        });
    });

    it("executes a before() and after() callback if provided", function(done){
        var callback = sandbox.spy(),
            sequence = [1,2,3],
            delay = 50,
            before = sandbox.spy(),
            after = sandbox.spy(),
            seq = looper.sequencer(sequence, callback, delay, {
                before: before,
                after: after
            });
        seq.then(function(){
            sinon.assert.calledOnce(before);
            sinon.assert.calledOnce(after);
            done();
        });
    });
});

