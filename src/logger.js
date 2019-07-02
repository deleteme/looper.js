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
    const runsPerSecond = (runs / duration) * 1000;
    const functionsPerSecond = (totalFunctions / duration) * 1000;
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
export default makeLogger;
