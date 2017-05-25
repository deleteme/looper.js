/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
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

/* harmony default export */ __webpack_exports__["default"] = (looper);


/***/ })
/******/ ]);
