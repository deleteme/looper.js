import { on, off } from './dom/event.js';
import { $$ } from './dom/query.js'

const body = () => $$('body')[0]

const clickElement = element => () => {
  return new Promise(resolve => {
    let directHandlerTimeout;
    const directHandler = () => {
      off(element, 'click', directHandler);
      directHandlerTimeout = setTimeout(() => {
        off(body(), 'click', bubblingHandler);
        resolve()
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
};
export default clickElement;
