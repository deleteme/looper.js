var $$ = selector => document.querySelectorAll(selector);

var body = () => $$('body')[0];

var click = element => new Promise(resolve => {
  var directHandlerTimeout;

  var directHandler = () => {
    element.removeEventListener('click', directHandler);
    directHandlerTimeout = setTimeout(() => {
      body().removeEventListener('click', bubblingHandler);
      resolve();
    }, 50);
  };

  var bubblingHandler = e => {
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

var clickElement = element => () => click(element);

var clickSelector = selector => () => {
  var [element] = $$(selector);
  return clickElement(element)();
};

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

var logMessage = '%s runs/s, %s functions/s';
var numLoggers = 0;

var makeLogger = () => {
  var start, runs, totalFunctions;
  numLoggers += 1;
  var id = numLoggers;
  var groupMessage = "".concat(id, ". Looping %s runs of %s functions");
  var timeMessage = "".concat(id, ". Duration");

  var logStart = (_runs, sequenceLength) => {
    start = Date.now();
    runs = _runs;
    totalFunctions = runs * sequenceLength;
    console.group(groupMessage, runs, sequenceLength);
    console.time(timeMessage);
  };

  var logEnd = value => {
    var end = Date.now(); // A min duration of 1 avoids Infinity runsPerSecond

    var duration = Math.max(end - start, 1);
    var runsPerSecond = runs / duration * 1000;
    var functionsPerSecond = totalFunctions / duration * 1000;
    console.log(logMessage, runsPerSecond.toFixed(1), functionsPerSecond.toFixed(1));
    console.timeEnd(timeMessage);
    console.groupEnd(groupMessage);
    return value;
  };

  return {
    logStart,
    logEnd
  };
};

var looper = function looper(sequence) {
  var runs = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 27;
  var {
    logStart,
    logEnd
  } = makeLogger();

  function loop(_x) {
    return _loop.apply(this, arguments);
  }

  function _loop() {
    _loop = _asyncToGenerator(function* (value) {
      var currentRun = 0;
      logStart(loop.runs, loop.sequence.length);

      while (currentRun < loop.runs) {
        for (var step of sequence) {
          value = yield step(value);
        }

        currentRun += 1;
      }

      logEnd(value);
      return value;
    });
    return _loop.apply(this, arguments);
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
looper.clickElement = clickElement;
looper.clickSelector = clickSelector;

export default looper;
