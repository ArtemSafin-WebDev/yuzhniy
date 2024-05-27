import Select from "./classes/Select";

export default function eventsSelects() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".js-events-select")
  );

  elements.forEach((element) => {
    new Select(element);
  });
}
