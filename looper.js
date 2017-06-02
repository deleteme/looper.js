/*
Usage:
const sequence = [function(){}, function(){}, function(){}];
const loop = looper(sequence, 153);
loop();
*/
import clickSelector from './src/click-selector'
import clickElement from './src/click-element';

const looper = (sequence, runs = 27) => {

  const groupMessage = 'Looping %s runs of %s functions';
  const logMessage   = '%s runs/s, %s functions/s';

  function loop(value){
    return new Promise(resolve => {
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
  loop.runs = runs;

  return loop;

};

looper.click = clickElement;
looper.clickSelector = clickSelector;

export default looper;
