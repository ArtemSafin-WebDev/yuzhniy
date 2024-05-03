export default function catalog() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".catalog")
  );

  elements.forEach((element) => {
    const accordions = Array.from(
      element.querySelectorAll<HTMLElement>(".catalog__categories-accordion")
    );

    accordions.forEach((accordion) => {
      const btn = accordion.querySelector<HTMLElement>(
        ".catalog__categories-accordion-btn"
      );

      btn?.addEventListener("click", (event) => {
        event.preventDefault();
        accordions.forEach((otherAccordion) => {
          if (otherAccordion === accordion) return;
          otherAccordion.classList.remove("active");
          accordion.classList.toggle("active");
        });
      });
    });

    const mobileBtn = element.querySelector<HTMLElement>(
      ".catalog__mobile-categories-btn"
    );

    mobileBtn?.addEventListener("click", (event) => {
      event.preventDefault();

      console.log("Clicked button");
      mobileBtn.parentElement?.classList.toggle("active");
    });
  });
}
