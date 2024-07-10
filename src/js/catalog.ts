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

    const mobileCategoriesDropdownLinks = Array.from(
      element.querySelectorAll<HTMLAnchorElement>(
        ".catalog__mobile-categories-dropdown-link"
      )
    );

    const mobileCategoriesBtnText = element.querySelector<HTMLSpanElement>(
      ".catalog__mobile-categories-btn-text"
    );

    const mobileCategoriesBtnIcon = element.querySelector<HTMLImageElement>(
      ".catalog__mobile-categories-btn-icon"
    );

    const mobileTabs = Array.from(
      element.querySelectorAll<HTMLElement>(
        ".catalog__mobile-categories-tabs-item"
      )
    );

    const setActiveLink = (index: number) => {
      mobileCategoriesDropdownLinks.forEach(
        (link) => (link.parentElement!.style.display = "")
      );
      const currentLink = mobileCategoriesDropdownLinks[index];
      if (currentLink?.parentElement)
        currentLink.parentElement.style.display = "none";

      mobileTabs.forEach((tab) => tab.classList.remove("active"));
      mobileTabs[index]?.classList.add("active");

      const linkText = currentLink
        .querySelector<HTMLSpanElement>("span")
        ?.textContent?.trim();
      const linkImage = currentLink.querySelector<HTMLImageElement>("img")?.src;

      if (linkText && mobileCategoriesBtnText)
        mobileCategoriesBtnText.textContent = linkText;
      if (linkImage && mobileCategoriesBtnIcon)
        mobileCategoriesBtnIcon.src = linkImage;

      mobileBtn?.parentElement?.classList.remove("active");
    };

    if (mobileCategoriesDropdownLinks.length && mobileTabs.length) {
      mobileCategoriesDropdownLinks.forEach((link, linkIndex) => {
        link.addEventListener("click", (event) => {
          event.preventDefault();
          setActiveLink(linkIndex);
        });
      });

      setActiveLink(0);
    }

    mobileBtn?.addEventListener("click", (event) => {
      event.preventDefault();

      console.log("Clicked button");
      mobileBtn.parentElement?.classList.toggle("active");
    });
  });
}
