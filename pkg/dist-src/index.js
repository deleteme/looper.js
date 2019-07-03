/*
Usage:
const sequence = [function(){}, function(){}, function(){}];
const loop = looper(sequence, 153);
loop();
*/
import clickSelector from './click-selector.js';
import clickElement from './click-element.js';
import looper from './looper.js';
looper.clickElement = clickElement;
looper.clickSelector = clickSelector;
export default looper;