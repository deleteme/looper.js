import looper from './src/index.js';
import { $, $$ } from './src/dom/query.js';
import { on } from './src/dom/event.js';

const originalCountValue = Number($('count').value);
const initialState = { isReset: true, isStarted: false, isFinished: false };
var state = initialState;

const setState = newState => {
  state = {
    ...state,
    ...newState
  };
  render();
};

const render = () => {
  const { isStarted, isFinished } = state;
  const isDisabled = isStarted && !isFinished;
  $('start-loop-button').disabled = isDisabled;
  $('looper-loop-button').disabled = isDisabled;
  $('log').innerHTML = isFinished ? "<span style='color:red;'>Done</span>" : '';
};

const reset = () => {
  for (let element of $$('.modal')) {
    element.parentNode.removeChild(element);
  }
  setState(initialState);
  $('count').value = originalCountValue;
  window.modals.length = 0;
};

// example looper setup
on($('start-loop-button'), 'click', async () => {
  const setup = async () => {
    await looper.clickSelector('#show-modal-button')();
    return new Promise(requestAnimationFrame);
  };
  const teardown = async () => {
    await looper.clickSelector('#hide-modal-button')();
    return new Promise(requestAnimationFrame);
  };
  const runs = Number($('count').value);
  const loop = looper([setup, teardown], runs);
  setState({ isStarted: true, isFinished: false, loop: loop() });
  await state.loop;
  setState({ isFinished: true });
});

on($('reset-button'), 'click', reset);

// loop the looper!
on($('looper-loop-button'), 'click', async () => {
  await looper(
    [
      looper.clickSelector('#reset-button'),
      looper.clickSelector('#start-loop-button'),
      () => state.loop
    ],
    3
  )();
});
