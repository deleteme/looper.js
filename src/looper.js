import makeLogger from './logger';

const looper = (sequence, runs = 27) => {
  const { logStart, logEnd } = makeLogger();

  async function loop(value) {
    let currentRun = 0;
    logStart(loop.runs, loop.sequence);
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

export default looper;
