const looper = (sequence, runs = 27) => {
  const groupMessage = 'Looping %s runs of %s functions';
  const logMessage = '%s runs/s, %s functions/s';

  async function loop(value) {
    console.group(groupMessage, loop.runs, loop.sequence.length);
    console.time('Duration');

    const start = Date.now();
    const sl = loop.sequence.length;
    const l = loop.runs * sl;
    let i = 0;

    function log(val) {
      const end = Date.now();
      const duration = end - start;
      const runsPerSecond = loop.runs / duration * 1000;
      const functionsPerSecond = l / duration * 1000;
      console.log(
        logMessage,
        runsPerSecond.toFixed(1),
        functionsPerSecond.toFixed(1)
      );
      console.timeEnd('Duration');
      console.groupEnd(groupMessage);
      return val;
    }
    const p = new Promise(resolve => {
      async function next(val) {
        const fn = loop.sequence[i % sl];
        if (i < l) {
          i++;
          const result = await fn(val);
          next(result);
        } else {
          resolve(val);
        }
      }

      next(value);
    });
    const val = await p;
    log(val);
    return p;
  }

  loop.sequence = sequence;
  loop.runs = runs;

  return loop;
};

export default looper;
