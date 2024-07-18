import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function homeCatalogAnimation() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".home-catalog")
  );

  let mm = gsap.matchMedia();

  mm.add("(min-width: 641px)", () => {
    elements.forEach((element) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: element,
          start: "top+=20% bottom",
          end: "bottom top",
          markers: false,
        },
      });

      const heading = element.querySelector<HTMLElement>(
        ".home-catalog__heading"
      );

      const buttons = Array.from(
        element.querySelectorAll<HTMLElement>(".home-catalog__types")
      );

      const listItems = Array.from(
        element.querySelectorAll<HTMLElement>(".home-catalog__list-item")
      );

      if (heading) {
        tl.from(heading, {
          autoAlpha: 0,
          duration: 1,
          ease: "power2.out",
        });
      }

      if (buttons) {
        tl.from(
          buttons,
          {
            autoAlpha: 0,
            duration: 1,
            ease: "power2.out",
          },
          "<"
        );
      }

      if (listItems.length) {
        tl.from(listItems, {
          autoAlpha: 0,
          duration: 1,
          stagger: 0.3,
          ease: "power2.out",
          y: 40,
        });
      }
    });
  });
}
