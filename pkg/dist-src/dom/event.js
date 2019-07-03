export const on = (element, type, handler) => element.addEventListener(type, handler);
export const off = (element, type, handler) => element.removeEventListener(type, handler);
export default {
  on,
  off
};