import clickElement from './click-element';

const clickSelector = selector => () => {
  const element = document.querySelectorAll(selector)[0];
  return clickElement(element)();
};

export default clickSelector;
