/*
Usage:
    var sequence = [function(){}, function(){}, function(){}];
    var loop = looper(sequence, 153);
    loop();
*/
var looper = function(sequence, runs){

    var loop = function(value){
        var start = Date.now();
        var all   = [];
        var sl    = loop.sequence.length;
        var l     = loop.runs * sl;
        var i     = 0;
        var log = function(value){
            var end = Date.now();
            var duration = end - start;
            var runsPerSecond = (loop.runs / duration) * 1000;
            console.log('looper finished ' + loop.runs +
                ' runs in ' + duration + ' ms. ' +
                'Average ' + (runsPerSecond).toFixed(1) +
                ' runs per second.');
            return value;
        };

        while (i < l) {
            all[i] = loop.sequence[i % sl];
            i++;
        }

        return all.reduce(Q.when, Q(value)).then(log, log);

    };

    loop.sequence = sequence;
    loop.runs = runs || 25;

    return loop;

};
