import clickElement from './click-element.js';
import { $$ } from './dom/query.js'

const clickSelector = selector => () => {
  const [element] = $$(selector);
  return clickElement(element)();
};

export default clickSelector;
