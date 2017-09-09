import wrap from './wrap.js';
export const on = wrap((element, type, handler) =>
  element.addEventListener(type, handler)
);
export const off = wrap((element, type, handler) =>
  element.removeEventListener(type, handler)
);
export default { on, off };
