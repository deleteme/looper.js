/*
Usage:
var sequence = [function(){}, function(){}, function(){}];
var loop = looper(sequence, 153);
loop();
*/
var looper = function(sequence, runs){

  var groupMessage = 'Looping %s runs of %s functions';
  var logMessage   = '%s runs/s, %s functions/s';
  var defaultRuns  = 27;

  function loop(value){
    return new Promise(function(resolve){
      console.group(groupMessage, loop.runs, loop.sequence.length);
      console.time('Duration');
      var start = Date.now();
      var sl    = loop.sequence.length;
      var l     = loop.runs * sl;
      var i     = 0;
      function log(val){
        var end                = Date.now();
        var duration           = end - start;
        var runsPerSecond      = loop.runs / duration * 1000;
        var functionsPerSecond = l / duration * 1000;
        console.log(logMessage, (runsPerSecond).toFixed(1), (functionsPerSecond).toFixed(1));
        console.timeEnd('Duration');
        console.groupEnd(groupMessage);
        return val;
      }

      function next(val){
        var fn = loop.sequence[i % sl];
        if (i < l) {
          i++;
          return Promise.resolve(fn(val)).then(next);
        } else {
          log(val);
          resolve(val);
        }
      }

      next(value);

    });
  }

  loop.sequence = sequence;
  loop.runs = runs || defaultRuns;

  return loop;

};


looper.click = function(el){
  return function(){
    return new Promise(function(resolve){
      var $el = $(el).eq(0);
      $el.on('click.looper', function(){
        setTimeout(resolve, 250);
        $el.off('click.looper');
      });
      $el.get(0).click();
    });
  };
};

looper.clickSelector = function(selector){
  return function(){
    return new Promise(function(resolve){
      $(selector).eq(0).click();
      setTimeout(resolve, 100);
    });
  };
};

looper.sequencer = function(sequence, callback, delay) {
  var max = sequence.length,
      timeout;
  return new Promise(function(resolve){
    timeout = setTimeout(function(){
      sequence.forEach(function(current, index){
        setTimeout(function(){
          callback(current, index, max);
          if( index === max - 1 ) {
            resolve();
          }
        }, delay * index);
      });
    }, delay);
  });
};
