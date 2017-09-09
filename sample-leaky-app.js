import looper from "./index.js";
const $ = id => document.getElementById(id);
const $$ = selector => document.querySelectorAll(selector);
const wrap2 = func =>
  function process(elements) {
    if (!elements) return;
    const args = Array.from(arguments).slice(1);
    if (elements instanceof Element) elements = [elements];
    for (let element of elements) {
      func.apply(this, [element, ...args]);
    }
  };
const show = wrap2(element => element.classList.remove("hidden"));
const hide = wrap2(element => element.classList.add("hidden"));
const on = wrap2((element, type, handler) =>
  element.addEventListener(type, handler)
);

// leaky app
function make() {
  const element = document.createElement("div");
  element.className = "modal";
  element.innerHTML = "modal";
  document.body.appendChild(element);
  return element;
}

const showModal = () => {
  hideModal();
  show(make());
};

const hideModal = () => hide($$(".modal"));

on($("show-button"), "click", showModal);
on($("hide-button"), "click", hideModal);

// example looper setup
const setup = looper.clickSelector("#show-button");
const teardown = looper.clickSelector("#hide-button");
const runs = 53;
$("count").value = runs;
const loop = looper([setup, teardown], runs);

on($("loop"), "click", async () => {
  await loop();
  $("log").innerHTML = "<span style='color:red;'>Done</span>";
});
