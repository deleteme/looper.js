var looper = (function() {
  'use strict';

  const $$ = selector => document.querySelectorAll(selector);

  const body = () => $$('body')[0];

  const click = element =>
    new Promise(resolve => {
      let directHandlerTimeout;
      const directHandler = () => {
        element.removeEventListener('click', directHandler);
        directHandlerTimeout = setTimeout(() => {
          body().removeEventListener('click', bubblingHandler);
          resolve();
        }, 50);
      };
      const bubblingHandler = e => {
        if (e.target === element) {
          body().removeEventListener('click', bubblingHandler);
          clearTimeout(directHandlerTimeout);
          setTimeout(resolve, 0);
        }
      };
      element.addEventListener('click', directHandler);
      body().addEventListener('click', bubblingHandler);
      element.click();
    });

  const clickElement = element => () => click(element);

  const clickSelector = selector => () => {
    const [element] = $$(selector);
    return clickElement(element)();
  };

  const logMessage = '%s runs/s, %s functions/s';

  var numLoggers = 0;

  const makeLogger = () => {
    let start, runs, totalFunctions;
    numLoggers += 1;

    const id = numLoggers;
    const groupMessage = `${id}. Looping %s runs of %s functions`;
    const timeMessage = `${id}. Duration`;

    const logStart = (_runs, sequenceLength) => {
      start = Date.now();
      runs = _runs;
      totalFunctions = runs * sequenceLength;
      console.group(groupMessage, runs, sequenceLength);
      console.time(timeMessage);
    };

    const logEnd = value => {
      const end = Date.now();
      // A min duration of 1 avoids Infinity runsPerSecond
      const duration = Math.max(end - start, 1);
      const runsPerSecond = runs / duration * 1000;
      const functionsPerSecond = totalFunctions / duration * 1000;
      console.log(
        logMessage,
        runsPerSecond.toFixed(1),
        functionsPerSecond.toFixed(1)
      );
      console.timeEnd(timeMessage);
      console.groupEnd(groupMessage);
      return value;
    };

    return {
      logStart,
      logEnd
    };
  };

  const looper$1 = (sequence, runs = 27) => {
    const { logStart, logEnd } = makeLogger();

    async function loop(value) {
      let currentRun = 0;
      logStart(loop.runs, loop.sequence.length);
      while (currentRun < loop.runs) {
        for (let step of sequence) {
          value = await step(value);
        }
        currentRun += 1;
      }
      logEnd(value);
      return value;
    }

    loop.sequence = sequence;
    loop.runs = runs;

    return loop;
  };

  /*
Usage:
const sequence = [function(){}, function(){}, function(){}];
const loop = looper(sequence, 153);
loop();
*/
  looper$1.clickElement = clickElement;
  looper$1.clickSelector = clickSelector;
  window.looper = looper$1;

  return looper$1;
})();
