import gsap from "gsap";

export default function loader() {
  const loader = document.querySelector<HTMLElement>(".loader");
  if (!loader) return;

  window.addEventListener("load", () => {
    setTimeout(() => {
      document.body.classList.add("loader-hidden");
      const tl = gsap.timeline();
      tl.to(loader, {
        autoAlpha: 0,
        duration: 0.4,
      });

      const topRow = document.querySelector<HTMLElement>(
        ".page-header__top-row"
      );

      if (topRow) {
        tl.from(
          topRow,
          {
            autoAlpha: 0,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "all",
          },
          0
        );
      }

      const bottomRow = document.querySelector<HTMLElement>(
        ".page-header__bottom-row"
      );
      if (bottomRow) {
        tl.from(
          bottomRow,
          {
            autoAlpha: 0,
            y: -20,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "all",
          },
          0
        );
      }

      const introSlider = document.querySelector<HTMLElement>(".intro");
      if (introSlider) {
        tl.from(
          introSlider,
          {
            autoAlpha: 0,
            duration: 0.4,
          },
          0
        );

        tl.fromTo(
          ".swiper-slide:first-child .intro__slider-card-bg-image",
          {
            scale: 1.4,
          },
          {
            duration: 1,
            scale: 1,
            clearProps: "all",
          },
          "<"
        );

        tl.fromTo(
          ".swiper-slide:first-child .intro__slider-card-title",
          {
            y: 60,
          },
          {
            y: 0,
            duration: 1,
          },
          "<"
        );
        tl.fromTo(
          ".swiper-slide:first-child .intro__slider-card-text",
          {
            autoAlpha: 0,
          },
          {
            autoAlpha: 1,
            duration: 1,
          },
          "<"
        );
      }

      if (window.matchMedia("(max-width: 640px)").matches) return;

      const catalogLeftCol =
        document.querySelector<HTMLElement>(".catalog__left-col");

      if (catalogLeftCol) {
        tl.from(
          catalogLeftCol,
          {
            autoAlpha: 0,
            duration: 0.8,
          },
          "<+=0.2"
        );
      }

      const catalogBlocks = Array.from(
        document.querySelectorAll<HTMLElement>(".catalog__block")
      );

      catalogBlocks.forEach((block, blockIndex) => {
        const catalogBlockHeading = block.querySelector<HTMLElement>(
          ".catalog__block-heading"
        );
        const catalogListItems = Array.from(
          block.querySelectorAll(".catalog__block-list-item")
        );

        const extraListItems = Array.from(
          block.querySelectorAll<HTMLElement>(".catalog__extra-list-item")
        );

        if (catalogBlockHeading) {
          tl.from(
            catalogBlockHeading,
            {
              autoAlpha: 0,
              duration: 0.6,
            },
            "<+=0.2"
          );
        }

        if (catalogListItems.length) {
          tl.from(
            catalogListItems,
            {
              autoAlpha: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
              y: 40,
            },
            "<"
          );
        }
        if (extraListItems.length) {
          tl.from(
            extraListItems,
            {
              autoAlpha: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
              y: 40,
            },
            "<"
          );
        }
      });
    }, 300);
  });
}
