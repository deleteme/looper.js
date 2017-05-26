/*
Usage:
const sequence = [function(){}, function(){}, function(){}];
const loop = looper(sequence, 153);
loop();
*/
import clickSelector from './src/click-selector.js'

const looper = function(sequence, runs){

  const groupMessage = 'Looping %s runs of %s functions';
  const logMessage   = '%s runs/s, %s functions/s';
  const defaultRuns  = 27;

  function loop(value){
    return new Promise(function(resolve){
      console.group(groupMessage, loop.runs, loop.sequence.length);
      console.time('Duration');
      const start = Date.now();
      const sl    = loop.sequence.length;
      const l     = loop.runs * sl;
      let i       = 0;
      function log(val){
        const end                = Date.now();
        const duration           = end - start;
        const runsPerSecond      = loop.runs / duration * 1000;
        const functionsPerSecond = l / duration * 1000;
        console.log(logMessage, (runsPerSecond).toFixed(1), (functionsPerSecond).toFixed(1));
        console.timeEnd('Duration');
        console.groupEnd(groupMessage);
        return val;
      }

      async function next(val){
        const fn = loop.sequence[i % sl];
        if (i < l) {
          i++;
          const result = await fn(val)
          next(result);
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

looper.click = function(element){
  return function(){
    return new Promise(function(resolve){
      const handler = function(){
        setTimeout(resolve, 250);
        element.removeEventListener('click', handler);
      };
      element.addEventListener('click', handler);
      element.click();
    })
  };
};

looper.clickSelector = clickSelector;

export default looper;
