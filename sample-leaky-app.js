import looper from './index.js';
import { $, $$ } from './src/dom/query.js';
import { on } from './src/dom/event.js';

// leaky app
function make() {
  const element = document.createElement('div');
  element.className = 'modal';
  element.innerHTML = 'modal';
  document.body.appendChild(element);
  return element;
}

const showModal = () => {
  hideModal();
  make();
};

const hideModal = () => {
  for (let element of $$('.modal')) {
    element.classList.add('hidden');
  }
};

on($('show-modal-button'), 'click', showModal);
on($('hide-modal-button'), 'click', hideModal);

// example looper setup
on($('start-loop-button'), 'click', async () => {
  const setup = looper.clickSelector('#show-modal-button');
  const teardown = looper.clickSelector('#hide-modal-button');
  const runs = Number($('count').value);
  const loop = looper([setup, teardown], runs);
  $('start-loop-button').disabled = true;
  $('log').innerHTML = '';
  await loop();
  $('start-loop-button').disabled = false;
  $('log').innerHTML = "<span style='color:red;'>Done</span>";
});

on($('reset-button'), 'click', () => {
  for (let element of $$('.modal')) {
    element.parentNode.removeChild(element);
  }
});

// loop the looper!
on($('looper-loop-button'), 'click', async () => {
  await looper(
    [
      looper.clickSelector('#start-loop-button'),
      () => {
        // poll for the looping to finish
        return new Promise(resolve => {
          const poll = () => {
            const isFinished = !$('start-loop-button').disabled;
            if (isFinished) {
              clearInterval(pollingInterval);
              resolve();
            }
          };
          let pollingInterval = setInterval(poll, 10);
        });
      },
      looper.clickSelector('#reset-button')
    ],
    3
  )();
});
