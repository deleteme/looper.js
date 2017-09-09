import { on, off } from './dom/event.js';

const clickElement = element => () =>
  new Promise(resolve => {
    const handler = () => {
      off(element, 'click', handler);
      setTimeout(resolve, 50);
    };
    on(element, 'click', handler);
    element.click();
  });

export default clickElement;
