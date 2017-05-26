import timeout from './timeout';

const noop = () => {
  return undefined;
};

const clickSelector = selector => () => {
  document.querySelectorAll(selector)[0].click();
  return timeout(noop, 100);
};

export default clickSelector;
