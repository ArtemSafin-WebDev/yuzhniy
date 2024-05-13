export default function modals() {
  const OPEN_BTN_SELECTOR = "a[href^='#']";
  const CLOSE_BTN_SELECTOR = ".js-modal-close";

  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (
      target.matches(OPEN_BTN_SELECTOR) ||
      target.closest(OPEN_BTN_SELECTOR)
    ) {
      const btn = target.matches(OPEN_BTN_SELECTOR)
        ? (target as HTMLAnchorElement)
        : target.closest<HTMLAnchorElement>(OPEN_BTN_SELECTOR);
      if (!btn) return;
      const hash = btn.hash;
      if (!hash) return;
      const modal = document.querySelector<HTMLElement>(`.js-modal${hash}`);
      if (!modal) return;
      document.body.classList.remove("menu-open");
      event.preventDefault();
      const otherModals = Array.from(
        document.querySelectorAll<HTMLElement>(".js-modal")
      );
      otherModals.forEach((modal) => modal.classList.remove("active"));
      modal?.classList.add("active");
      document.body.classList.add("modal-open");
    }
  });
  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (
      target.matches(CLOSE_BTN_SELECTOR) ||
      target.closest(CLOSE_BTN_SELECTOR)
    ) {
      event.preventDefault();
      const modals = Array.from(
        document.querySelectorAll<HTMLElement>(".js-modal")
      );
      modals.forEach((modal) => modal.classList.remove("active"));
      document.body.classList.remove("modal-open");
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target as HTMLElement;
    if (target.matches(".js-modal")) {
      target.classList.remove("active");
      document.body.classList.remove("modal-open");
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const modals = Array.from(
        document.querySelectorAll<HTMLElement>(".js-modal")
      );
      modals.forEach((modal) => modal.classList.remove("active"));
      document.body.classList.remove("modal-open");
    }
  });
}
