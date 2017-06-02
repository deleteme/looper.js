import makeLogger from './logger';

const looper = (sequence, runs = 27) => {
  const { logStart, logEnd } = makeLogger();

  async function loop(value) {
    const sl = loop.sequence.length;
    const l = loop.runs * sl;
    let i = 0;

    logStart(loop.runs, loop.sequence);

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
    logEnd(val);
    return p;
  }

  loop.sequence = sequence;
  loop.runs = runs;

  return loop;
};

export default looper;
