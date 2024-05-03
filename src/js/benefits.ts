import Swiper from "swiper";
import { Pagination, Navigation, Controller, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export default function benefitsSlider() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".benefits")
  );
  const mql = window.matchMedia("(max-width: 640px)");

  elements.forEach((element) => {
    const imagesContainer = element.querySelector<HTMLElement>(
      ".benefits__slider-images .swiper"
    );
    const cardsContainer = element.querySelector<HTMLElement>(
      ".benefits__slider-cards .swiper"
    );

    let imageInstance: Swiper | null = null;
    let cardsInstance: Swiper | null = null;

    const handleWidthChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        if (imageInstance) imageInstance.destroy();
        if (cardsInstance) cardsInstance.destroy();

        if (imagesContainer) {
          imageInstance = new Swiper(imagesContainer, {
            slidesPerView: 1,
            speed: 600,
            modules: [Navigation],
            navigation: {
              prevEl: element.querySelector<HTMLElement>(
                ".benefits__slider-arrow--prev"
              ),
              nextEl: element.querySelector<HTMLElement>(
                ".benefits__slider-arrow--next"
              ),
            },
          });
        }

        if (cardsContainer) {
          cardsInstance = new Swiper(cardsContainer, {
            slidesPerView: "auto",
            speed: 600,
            modules: [Pagination],
            pagination: {
              el: element.querySelector<HTMLElement>(
                ".benefits__slider-cards-pagination"
              ),
              type: "bullets",
              clickable: true,
            },
          });
        }
      } else {
        if (imageInstance) imageInstance.destroy();
        if (cardsInstance) cardsInstance.destroy();

        cardsInstance = null;
        imageInstance = null;

        if (imagesContainer) {
          imageInstance = new Swiper(imagesContainer, {
            speed: 600,
            slidesPerView: 1,
            effect: "fade",
            longSwipesRatio: 0.2,
            fadeEffect: {
              crossFade: false,
            },
            modules: [Navigation, Pagination, Controller, EffectFade],
            navigation: {
              prevEl: element.querySelector<HTMLElement>(
                ".benefits__slider-arrow--prev"
              ),
              nextEl: element.querySelector<HTMLElement>(
                ".benefits__slider-arrow--next"
              ),
            },
          });
        }

        if (cardsContainer) {
          cardsInstance = new Swiper(cardsContainer, {
            slidesPerView: 1,
            spaceBetween: 20,
            speed: 600,
            modules: [Controller],
          });
        }

        if (cardsInstance && imageInstance) {
          cardsInstance.controller.control = imageInstance;
          imageInstance.controller.control = cardsInstance;
        }
      }
    };

    mql.addEventListener("change", handleWidthChange);

    handleWidthChange(mql);
  });
}
