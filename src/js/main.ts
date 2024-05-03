import "virtual:svg-icons-register";
import "../scss/style.scss";
import benefitsSlider from "./benefits";
import intro from "./intro";
import header from "./header";
import loader from "./loader";
import catalog from "./catalog";

document.addEventListener("DOMContentLoaded", () => {
  benefitsSlider();
  intro();
  header();
  loader();
  catalog();
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
