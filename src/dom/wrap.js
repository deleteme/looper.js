export default function wrap(func) {
  return function process(elements) {
    if (!elements) return;
    const args = Array.from(arguments).slice(1);
    if (elements instanceof Element) elements = [elements];
    for (let element of elements) {
      func.apply(this, [element, ...args]);
    }
  };
}
