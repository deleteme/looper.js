/*
Usage:
var sequence = [function(){}, function(){}, function(){}];
var loop = looper(sequence, 153);
loop();
*/
var looper = function(sequence, runs){

  var resolver     = Q.defer();
  var promise      = resolver.promise;
  var groupMessage = 'Looping %s runs of %s functions';
  var logMessage   = '%s runs/s, %s functions/s';
  var defaultRuns  = 27;

  var loop = function(value){
    console.group(groupMessage, loop.runs, loop.sequence.length);
    console.time('Duration');
    var start = Date.now();
    var all   = [];
    var sl    = loop.sequence.length;
    var l     = loop.runs * sl;
    var i     = 0;
    var log = function(value){
      var end                = Date.now();
      var duration           = end - start;
      var runsPerSecond      = loop.runs / duration * 1000;
      var functionsPerSecond = l / duration * 1000;
      console.log(logMessage, (runsPerSecond).toFixed(1), (functionsPerSecond).toFixed(1));
      console.timeEnd('Duration');
      console.groupEnd(groupMessage);
      return value;
    };

    function next(value){
      var fn = loop.sequence[i % sl];
      if (i < l) {
        i++;
        return Q.fcall(fn, value).then(next);
      } else {
        resolver.resolve(value);
      }
    }

    next(value);

    return promise.then(log, log);

  };

  loop.sequence = sequence;
  loop.runs = runs || defaultRuns;

  return loop;

};
