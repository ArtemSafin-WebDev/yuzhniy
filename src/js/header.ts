import gsap from "gsap";

export default function header() {
  const header = document.querySelector<HTMLElement>(".page-header");
  if (!header) return;

  const searches = Array.from(
    header.querySelectorAll<HTMLElement>(".page-header__search")
  );

  searches.forEach((search) => {
    const btn = search.querySelector<HTMLButtonElement>(
      ".page-header__search-btn"
    );
    const inputWrapper = search.querySelector<HTMLElement>(
      ".page-header__search-input-wrapper"
    );
    if (btn) {
      btn.addEventListener("click", (event) => {
        const isOpen = search.classList.contains("open");
        event.preventDefault();
        if (isOpen) {
          search.classList.remove("open");
          if (inputWrapper) {
            gsap.to(inputWrapper, {
              width: 0,
              duration: 0.5,
            });
          }
        } else {
          search.classList.add("open");
          if (inputWrapper) {
            gsap.to(inputWrapper, {
              width: "auto",
              duration: 0.5,
            });
          }
        }
      });
    }

    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (
        target.matches(".page-header__search") ||
        target.closest(".page-header__search")
      )
        return;
      search.classList.remove("open");
      if (inputWrapper) {
        gsap.to(inputWrapper, {
          width: 0,
          duration: 0.5,
        });
      }
    });
  });

  const menuOpen = header.querySelector<HTMLButtonElement>(
    ".page-header__burger"
  );
  const menuClose = header.querySelector<HTMLButtonElement>(
    ".page-header__menu-close"
  );

  menuOpen?.addEventListener("click", (event) => {
    event.preventDefault();
    document.body.classList.add("menu-open");
  });

  menuClose?.addEventListener("click", (event) => {
    event.preventDefault();
    document.body.classList.remove("menu-open");
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.body.classList.remove("menu-open");
    }
  });
}
