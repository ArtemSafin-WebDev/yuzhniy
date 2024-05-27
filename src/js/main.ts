import "virtual:svg-icons-register";
import "../scss/style.scss";
import benefitsSlider from "./benefits";
import intro from "./intro";
import header from "./header";
import loader from "./loader";
import catalog from "./catalog";
import modals from "./modals";
import fileUpload from "./fileUpload";
import selects from "./selects";
import forms from "./forms";
import catalogDetail from "./catalogDetail";
import tabs from "./tabs";
import eventsSelects from "./eventsSelects";
import eventsDatepicker from "./eventsDatepicker";
import eventDetail from "./eventDetail";

document.addEventListener("DOMContentLoaded", () => {
  benefitsSlider();
  intro();
  header();
  loader();
  catalog();
  selects();
  fileUpload();
  modals();
  tabs();
  forms();
  catalogDetail();
  eventDetail();
  eventsSelects();
  eventsDatepicker();
});

window.addEventListener("load", () => {
  document.body.classList.add("loaded");
});
