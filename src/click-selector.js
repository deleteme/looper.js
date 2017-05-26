import timeout from './timeout';

const noop = () => {
  return undefined;
};

const clickSelector = function(selector){
  return function(){
    document.querySelectorAll(selector)[0].click();
    return timeout(noop, 100);
  };
};

export default clickSelector;
