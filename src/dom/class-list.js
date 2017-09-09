import wrap from './wrap.js';
export const addClass = wrap((element, className) =>
  element.classList.add(className)
);
export const removeClass = wrap((element, className) =>
  element.classList.remove(className)
);
export default { addClass, removeClass };
