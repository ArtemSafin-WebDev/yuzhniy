import Select from "./classes/Select";

export default function selects() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".js-select")
  );

  elements.forEach((element) => new Select(element));
}
