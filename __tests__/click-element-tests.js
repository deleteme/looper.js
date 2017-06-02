import clickElement from "../src/click-element.js";

const assertNotCalled = value => {
  throw new Error(`This should not be called. Received ${value}.`);
};

const makeElementWithId = id => {
  const element = document.createElement("div");
  element.id = id;
  document.body.appendChild(element);
  return element;
};

const removeElementById = id => {
  const element = document.getElementById(id);
  element.parentNode.removeChild(element);
};

describe("clickElement()", () => {
  it("should return a function.", () => {
    const element = makeElementWithId('some-element');
    expect(clickElement(element)).toBeInstanceOf(Function);
    removeElementById('some-element');
  });

  describe("returned function", () => {
    beforeEach(() => {
      ["target1", "target2", "target3"].forEach(makeElementWithId);
    });

    afterEach(() => {
      ["target1", "target2", "target3"].forEach(removeElementById);
    });

    it("should return a Promise.", () => {
      const element = document.getElementById('target1');
      expect(clickElement(element)()).toBeInstanceOf(Promise);
    });

    it("should resolve after a while.", () => {
      const element = document.getElementById('target2');
      const callback = jest.fn();
      const clicked = clickElement(element)().then(callback);
      expect.assertions(2);
      expect(callback).not.toHaveBeenCalled();
      const assert = () => expect(callback).toHaveBeenCalledTimes(1);
      return clicked.then(assert, assertNotCalled);
    });

    it("should trigger a click event on the element.", () => {
      const handler = jest.fn();
      const element = document.getElementById("target3");
      element.addEventListener("click", handler);
      const assert = () => {
        expect(handler).toHaveBeenCalledTimes(1);
      };
      return clickElement(element)().then(assert, assertNotCalled);
    });
  });
});
