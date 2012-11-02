describe('Looper', function(){
    var looper;
    var f = function(){return 'f'};
    var f2 = function(){return 'f2'};
    var noop = function(){};

    beforeEach(function(){
        looper = new Looper();
        looper.interval = 20;
    });
    it('should exist', function(){
        expect(Looper).to.be.ok();
    });
    it('should start with a count of zero', function(){
        expect(looper.count).to.be(0);
    });
    it('should start with an empty callbacks array', function(){
        expect(looper.callbacks.length).to.be(0);
    });
    describe('constructor options', function(){
        it('should set times', function(){
            var looper = new Looper({ times: 5 });
            expect(looper.times).to.be(5);
        });
        it('should set interval', function(){
            var looper = new Looper({ interval: 1234 });
            expect(looper.interval).to.be(1234);
        });
        it('should set callbacks', function(){
            var a = function(){ return 'a' },
                b = function(){ return 'b' },
                c = function(){ return 'c' },
                looper = new Looper({ callbacks: [a, b, c ]});

            expect(looper.callbacks).to.eql([a, b, c]);
        });
    });
    describe('has()', function(){
        it('should return true if callbacks includes value', function(){
            looper.add(f);
            expect(looper.has(f)).to.be(true);
        });
        it('should return false if callbacks does not include value', function(){
            looper.add(f2);
            expect(looper.has(f)).to.be(false);
        });
    });
    describe('add()', function(){
        it('should add function to callbacks', function(){
            looper.add(f);
            expect(looper.callbacks).to.contain(f);
            expect(looper.callbacks[0]).to.be(f);
        });
        it('should be chainable', function(){
            expect(looper.add()).to.be(looper);
            expect(looper.add().add()).to.be(looper);
        });
        it('should accept any number of arguments', function(){
            looper.add(f, f2);
            expect(looper.callbacks).to.contain(f);
            expect(looper.callbacks).to.contain(f2);
            expect(looper.callbacks.length).to.be(2);
        });
    });
    describe('remove()', function(){
        beforeEach(function(){
            looper.add(f);
        });
        it('should remove function from callbacks', function(){
            looper.remove(f);
            expect(looper.callbacks).not.to.contain(f);
            expect(looper.callbacks[0]).not.to.be(f);
        });
        it('should be chainable', function(){
            expect(looper.remove().remove()).to.be(looper);
        });
        it('should accept any number of arguments', function(){
            looper.add(f, f2).remove(f2, f);
            expect(looper.callbacks).not.to.contain(f);
            expect(looper.callbacks).not.to.contain(f2);
            expect(looper.callbacks.length).to.be(0);
        });
    });
    describe('empty()', function(){
        it('should remove all callbacks', function(){
            looper.add(f, f2).empty();
            expect(looper.has(f)).to.be(false);
            expect(looper.has(f2)).to.be(false);
        });
    });
    describe("start()", function(){
        /*
        NOPE 0               120ms
             ....            ....
        YARP 0   30  60  90  120 150 160 190
             .   .   .   .   .   .   .   .

        cycleinterval
        step interval = cycle interval / steps
        */
        it("should distribute the execution of the callbacks throughout the interval", function(done){
            var message = '';
            var a = function() { message += 'a' };
            var b = function() { message += 'b' };
            var c = function() { message += 'c' };
            var d = function() { message += 'd' };

            looper.interval = 200;
            looper.times = 1;

            looper.empty().add(a, b, c, d).done(done).start();

            expect(message).to.be('a');

            // when to tap into message and apply the expectation
            var taps = [75, 125, 175];
            setTimeout(function(){
                expect(message).to.be('ab');
            }, taps[0]);
            setTimeout(function(){
                expect(message).to.be('abc');
            }, taps[1]);
            setTimeout(function(){
                expect(message).to.be('abcd');
            }, taps[2]);
        });
        it("should not call every callback immediately", function(done){
            var message = '';
            var a = function(){ message += 'a'};
            var b = function(){ message += 'b'};
            looper.interval = 50;
            looper.empty().add(a, b).start();
            setTimeout(function(){
                expect(message).to.eql('a');
            }, 0);
            setTimeout(done, looper.interval);
        });
        it("should call the last callback after [interval]ms", function(done){
            var message = '';
            var a = function(){ message += 'a'};
            var b = function(){ message += 'b'};
            looper.interval = 50;
            looper.times = 1;
            looper.empty().add(a, b).start().
            done(function(){
                expect(message).to.eql('ab');
                done();
            });
        });
        it("should have called each handler [count] times every [interval]ms", function(done){
            var arr = [];
            var n = 5;
            looper.times = n;
            looper.add(function(i){
                arr.push(i);
            }).done(function(){
                expect(arr.length).to.be(5);
                expect(looper.count).to.be(5);
                done();
            }).start();
        });
        it("should call done() after it's finished", function(done){
            var finished = false;
            looper.times = 1;
            looper.interval = 70;
            looper.done(function(){
                finished = true;
            }).add(noop).start();
            setTimeout(function(){
                expect(finished).to.be(true);
                done();
            }, 200);
        });
        it("should be chainable", function(){
            expect(looper.start()).to.be(looper);
        });
        it("should reset the count back to zero", function(){
            looper.count = 1;
            looper.start();
            expect(looper.count).to.be(0);
        });
    });
    describe("done()", function(){
        it('should be chainable', function(){
            expect(looper.done()).to.be(looper);
        });
        it('should add a callback to be called when the loop is finished', function(){
            var myCallback = function (){ return 'my callback' };
            looper.done(myCallback);
            expect(looper._doneCallback).to.be(myCallback);
        });
        it('should execute the done callback when no argument is provided', function(){
            var message = 'not started';
            looper.done(function(){
                message = 'finished';
            });
            looper.done();
            expect(message).to.equal('finished');
        });
    });
    describe("stop()", function(){
        it("should halt the periodic execution of the callbacks", function(done){
            looper.times = 20;
            looper.add(noop).start();
            setTimeout(function(){
                looper.stop();
                expect(looper.count).to.be.within(1, 19);
                expect(looper.periodic).to.be(undefined);
                done();
            }, (looper.times / 2) * looper.interval);
        });
        it("should be chainable", function(){
            expect(looper.stop()).to.be(looper);
        });
    });
    describe('Static Methods:', function(){
        describe("_remove()", function(){
            var arr;
            beforeEach(function(){ arr = [0, 1]; });
            it("should not return the exact same instance", function(){
                expect(Looper._remove(arr)).not.to.be(arr);
            });
            it("should remove an item from an array", function(){
                expect(Looper._remove(arr, 0)).not.to.contain(0);
            });
            it("should not return a different array if it doesn't include the value", function(){
                expect(Looper._remove(arr, 2)).to.eql(arr);
                expect(Looper._remove(arr)).to.eql(arr);
            });
        });
    });
});
