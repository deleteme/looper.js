describe('looper', function(){
  var loop, cycle;
  var sandbox = sinon.sandbox.create();

  // yanked from http://stackoverflow.com/questions/4959975/generate-random-value-between-two-numbers-in-javascript
  function randomFromInterval(from,to) {
    return Math.floor(Math.random()*(to-from+1)+from);
  }

  beforeEach(function(){
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
    }).done();
  });

  it('is a promise of the final value.', function(done){
    var addOne = function(n){ return n + 1; };
    loop = looper([addOne, addOne]);
    loop.runs = 40;
    loop(0).then(function(n){
      expect(n).to.be(80);
      done();
    }).done();
  });

  it('defaults to 25 runs.', function(done){
    var runs = 25;
    loop().then(function(){
      expect(loop.runs).to.be(runs);
      sinon.assert.callCount(cycle[0], runs);
      sinon.assert.callCount(cycle[1], runs);
      sinon.assert.callCount(cycle[2], runs);
      done();
    }).done();
  });

  it("should respect changes to runs property after the function's been composed.", function(done){
    loop.runs = 123;
    loop().then(function(){
      sinon.assert.callCount(cycle[0], 123);
      sinon.assert.callCount(cycle[1], 123);
      sinon.assert.callCount(cycle[2], 123);
      done();
    }).done();
  });

  it('should console.log with a summary when finished.', function(done){
    sandbox.spy(console, 'log');
    var fixedRegExp = /^\d+\.\d$/;
    loop().then(function(){
      sinon.assert.calledWithMatch(console.log, '%s runs/s, %s functions/s', fixedRegExp, fixedRegExp);
      done();
    }).done();
  });

  // Using functions that finish in a random duration,
  // assert that looper is able to finish all runs and report.
  it('supports async functions of varying duration.', function(done){
    this.timeout(8000);
    var min = 0;
    var max = 500;
    var start = Date.now();
    var random = function(value){
      var delay = randomFromInterval(min, max);
      return Q.delay(delay).then(function(){
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
    }).done();
  });

});
