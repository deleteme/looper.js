/*
Usage:
const sequence = [function(){}, function(){}, function(){}];
const loop = looper(sequence, 153);
loop();
*/
import clickSelector from './src/click-selector.js'
import clickElement from './src/click-element.js';
import looper from './src/looper.js';

looper.clickElement = clickElement;
looper.clickSelector = clickSelector;
window.looper = looper;
export default looper;
