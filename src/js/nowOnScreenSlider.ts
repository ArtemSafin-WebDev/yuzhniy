import Swiper from "swiper";
import "swiper/css";
import { Navigation } from "swiper/modules";

export default function nowOnScreenSlider() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".js-now-on-screen-slider")
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
          ".now-on-screen__slider-arrow--prev"
        ),
        nextEl: element.querySelector<HTMLButtonElement>(
          ".now-on-screen__slider-arrow--next"
        ),
      },
    });
  });
}
