describe('looper', function(){
    var loop, cycle;
    var sandbox = sinon.sandbox.create();

    beforeEach(function(){
      cycle = [
          sandbox.spy(function(){
              //console.log(1);
          })
          , sandbox.spy(function(){
              //console.log(2);
          })
          , sandbox.spy(function(){
              //console.log(3);
              return 3;
          })
      ];
      loop = looper(cycle);
    });


    it('accepts a value, passed to the functions.', function(done){
        var addOne = sandbox.spy(function(n){ return n + 1; });
        var addTwo = sandbox.spy(function(n){ return n + 2; });
        loop = looper([addOne, addTwo]);
        loop.runs = 1;
        loop(0).then(function(n){
            sinon.assert.calledWith(addOne, 0);
            sinon.assert.calledWith(addTwo, 1);
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

    it('should call each function "runs" times.', function(done){
        loop.runs = 113;
        loop().then(function(n){
            expect(n).to.be(3);
            sinon.assert.callCount(cycle[0], loop.runs);
            sinon.assert.callCount(cycle[1], loop.runs);
            sinon.assert.callCount(cycle[2], loop.runs);
            done();
        }).done();
    });

});
