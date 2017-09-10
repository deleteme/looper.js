import { $$ } from './query.js';

const body = () => $$('body')[0];

const click = element =>
  new Promise(resolve => {
    let directHandlerTimeout;
    const directHandler = () => {
      element.removeEventListener('click', directHandler);
      directHandlerTimeout = setTimeout(() => {
        body().removeEventListener('click', bubblingHandler);
        resolve();
      }, 50);
    };
    const bubblingHandler = e => {
      if (e.target === element) {
        body().removeEventListener('click', bubblingHandler);
        clearTimeout(directHandlerTimeout);
        setTimeout(resolve, 0);
      }
    };
    element.addEventListener('click', directHandler);
    body().addEventListener('click', bubblingHandler);
    element.click();
  });
export default click;
