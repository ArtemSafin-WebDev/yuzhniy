import Swiper from "swiper";
import "swiper/css";
import "swiper/css/effect-fade";
import { Navigation, EffectFade, Controller } from "swiper/modules";

export default function cinemaAbout() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".js-cinema-about")
  );

  elements.forEach((element) => {
    const bgContainer = element.querySelector<HTMLElement>(
      ".cinema-about__bg .swiper"
    );
    const textContainer = element.querySelector<HTMLElement>(
      ".cinema-about__text-slider .swiper"
    );

    if (!bgContainer || !textContainer) return;

    const bgInstance = new Swiper(bgContainer, {
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      speed: 600,
      allowTouchMove: false,
      modules: [Navigation, Controller, EffectFade],
    });

    const textInstance = new Swiper(textContainer, {
      effect: "fade",
      fadeEffect: {
        crossFade: true,
      },
      speed: 600,
      autoHeight: true,
      modules: [Navigation, Controller, EffectFade],
      navigation: {
        prevEl: element.querySelector<HTMLElement>(
          ".cinema-about__arrow--prev"
        ),
        nextEl: element.querySelector<HTMLElement>(
          ".cinema-about__arrow--next"
        ),
      },
    });

    bgInstance.controller.control = textInstance;
    textInstance.controller.control = bgInstance;
  });
}
