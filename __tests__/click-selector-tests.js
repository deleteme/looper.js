import clickSelector from '../src/click-selector.js';

const assertNotCalled = value => {
  throw new Error(`This should not be called. Received ${value}.`);
};

const makeElementWithId = id => {
  const element = document.createElement('div');
  element.id = id;
  document.body.appendChild(element);
};

const removeElementById = id => {
  const element = document.getElementById(id);
  element.parentNode.removeChild(element);
};

describe('clickSelector', () => {
  it('should return a function.', () => {
    expect(clickSelector()).toBeInstanceOf(Function);
  });

  describe('returned function', () => {
    beforeEach(() => {
      ['target1', 'target2', 'target3'].forEach(makeElementWithId);
    });

    afterEach(() => {
      ['target1', 'target2', 'target3'].forEach(removeElementById);
    });

    it('should return a Promise.', () => {
      expect(clickSelector('#target1')()).toBeInstanceOf(Promise);
    });

    it('should resolve after 100ms.', () => {
      const callback = jest.fn();
      const clicked = clickSelector('#target2')().then(callback);
      expect.assertions(2);
      expect(callback).not.toHaveBeenCalled();
      const assert = () => expect(callback).toHaveBeenCalledTimes(1);
      return clicked.then(assert, assertNotCalled);
    });

    it('should click first element that matches the selector', () => {
      const handler = jest.fn();
      const element = document.getElementById('target3');
      element.addEventListener('click', handler);
      const assert = () => {
        expect(handler).toHaveBeenCalledTimes(1);
      };
      return clickSelector('#target3')().then(assert, assertNotCalled);
    });
  });
});
