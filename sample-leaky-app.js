import { $, $$ } from './src/dom/query.js';
import { on } from './src/dom/event.js';

// leaky app
window.modals = [];

function make() {
  const element = document.createElement('div');
  element.className = 'modal';
  element.innerHTML = 'modal';
  document.body.appendChild(element);
  modals.push(element);
  return element;
}

const showModal = () => {
  hideModal();
  make();
};

const hideModal = () => {
  for (let element of $$('.modal')) {
    element.parentNode.removeChild(element);
  }
};

on($('show-modal-button'), 'click', showModal);
on($('hide-modal-button'), 'click', hideModal);
