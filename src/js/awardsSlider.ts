import Swiper from "swiper";
import "swiper/css";
import { Navigation } from "swiper/modules";

export default function awardsSlider() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".js-awards-slider")
  );

  elements.forEach((element) => {
    const container = element.querySelector<HTMLElement>(".swiper");

    if (!container) return;

    new Swiper(container, {
      modules: [Navigation],
      slidesPerView: "auto",
      speed: 600,
      navigation: {
        prevEl: element.querySelector<HTMLButtonElement>(
          ".awards__arrow--prev"
        ),
        nextEl: element.querySelector<HTMLButtonElement>(
          ".awards__arrow--next"
        ),
      },
    });
  });
}
