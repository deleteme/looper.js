import { on, off } from './dom/event.js';
import { $$ } from './dom/query.js'

const clickElement = element => () => {
  const body = () => $$('body')[0]
  return new Promise(resolve => {
    const directHandler = () => {
      off(element, 'click', directHandler);
      setTimeout(resolve, 50);
    };
    const bubblingHandler = e => {
      if (e.target === element) {
        off(body(), 'click', bubblingHandler);
        setTimeout(resolve, 0);
      }
    };
    on(body(), 'click', bubblingHandler);
    on(element, 'click', directHandler);
    element.click();
  });
};
export default clickElement;
