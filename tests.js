describe('looper', function(){
    var loop;

    beforeEach(function(){
      var cycle = [
        sinon.stub()
        , sinon.stub()
        , sinon.stub()
        , sinon.stub()
        , sinon.stub()
      ];
      loop = looper(cycle);
    });

    it('should return a function', function(){
        expect(loop).to.be.a(Function);
    });

    it('should start with a progress of zero', function(){
        expect(loop.progress).to.be(0);
    });

    describe('returned function:', function(){

        it('should call each function "runs" times.', function(done){
            var runs = 3;
            loop.runs = runs;
            loop.duration = 1000;
            loop().then(function(){
                sinon.assert.callCount(cycle[0], runs);
                sinon.assert.callCount(cycle[1], runs);
                sinon.assert.callCount(cycle[2], runs);
                sinon.assert.callCount(cycle[3], runs);
                sinon.assert.callCount(cycle[4], runs);
                done();
            });
        });

        it('should finish after "duration".');
        
    });

});
