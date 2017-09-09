import looper from "./index.js";
import { $, $$ } from './src/dom/query.js'
import { on } from './src/dom/event.js';

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
  make()
};

const hideModal = () => {
  for (let element of $$(".modal")) {
    element.classList.add('hidden')
  }
}

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
