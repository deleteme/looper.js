const timeout = (callback, delay) =>
  new Promise(resolve =>
    setTimeout(() => {
      resolve(callback());
    }, delay)
  );

export default timeout;
