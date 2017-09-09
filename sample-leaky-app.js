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

on($("show-modal-button"), "click", showModal);
on($("hide-modal-button"), "click", hideModal);

// example looper setup
const setup = looper.clickSelector("#show-modal-button");
const teardown = looper.clickSelector("#hide-modal-button");
const runs = 53;
$("count").value = runs;
const loop = looper([setup, teardown], runs);

on($("start-loop-button"), "click", async () => {
  $("start-loop-button").disabled = true;
  await loop();
  $("start-loop-button").disabled = false;
  $("log").innerHTML = "<span style='color:red;'>Done</span>";
});
