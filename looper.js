/*
Usage:
const sequence = [function(){}, function(){}, function(){}];
const loop = looper(sequence, 153);
loop();
*/
import clickSelector from './src/click-selector'
import clickElement from './src/click-element';
import looper from './src/looper';

looper.click = clickElement;
looper.clickSelector = clickSelector;

export default looper;
