import { on, off } from './event.js';
import { $$ } from './query.js';

const body = () => $$('body')[0];

const click = element =>
  new Promise(resolve => {
    let directHandlerTimeout;
    const directHandler = () => {
      off(element, 'click', directHandler);
      directHandlerTimeout = setTimeout(() => {
        off(body(), 'click', bubblingHandler);
        resolve();
      }, 50);
    };
    const bubblingHandler = e => {
      if (e.target === element) {
        off(body(), 'click', bubblingHandler);
        clearTimeout(directHandlerTimeout);
        setTimeout(resolve, 0);
      }
    };
    on(element, 'click', directHandler);
    on(body(), 'click', bubblingHandler);
    element.click();
  });
export default click;
