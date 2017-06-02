const clickElement = element => () => {
  return new Promise(resolve => {
    const handler = () => {
      setTimeout(resolve, 50);
      element.removeEventListener("click", handler);
    };
    element.addEventListener("click", handler);
    element.click();
  });
};

export default clickElement;
