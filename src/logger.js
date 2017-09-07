const groupMessage = 'Looping %s runs of %s functions';
const logMessage = '%s runs/s, %s functions/s';
const makeLogger = () => {
  let start, runs, sequence, totalFunctions;

  const logStart = (_runs, _sequence) => {
    start = Date.now();
    runs = _runs;
    sequence = _sequence;
    totalFunctions = runs * sequence.length;
    console.group(groupMessage, runs, sequence.length);
    console.time('Duration');
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
    console.timeEnd('Duration');
    console.groupEnd(groupMessage);
    return value;
  };

  return {
    logStart,
    logEnd
  };
};
export default makeLogger;
