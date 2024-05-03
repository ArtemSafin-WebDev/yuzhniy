import Swiper from "swiper";
import { Pagination, Navigation, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import gsap from "gsap";

export default function intro() {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(".intro"));

  elements.forEach((element) => {
    const container = element.querySelector<HTMLElement>(".swiper");

    console.log("Intro swiper");
    if (!container) return;
    new Swiper(container, {
      slidesPerView: 1,
      modules: [Navigation, EffectFade, Pagination],
      speed: 1000,
      effect: "fade",
      longSwipesRatio: 0.2,
      fadeEffect: {
        crossFade: true,
      },
      navigation: {
        prevEl: element.querySelector<HTMLButtonElement>(
          ".intro__slider-arrow--prev"
        ),
        nextEl: element.querySelector<HTMLButtonElement>(
          ".intro__slider-arrow--next"
        ),
      },
      pagination: {
        el: element.querySelector<HTMLElement>(".intro__slider-pagination"),
        type: "bullets",
        clickable: true,
      },
      on: {
        slideChangeTransitionStart: (swiper) => {
          const slides = Array.from(swiper.slides);
          const prevSlide = slides[swiper.previousIndex];
          const nextSlide = slides[swiper.activeIndex];

          const tl = gsap.timeline();
          tl.fromTo(
            nextSlide.querySelector("img"),
            {
              scale: 1.4,
            },
            {
              duration: 1,
              scale: 1,
            },
            0
          );

          tl.fromTo(
            prevSlide.querySelector("img"),
            {
              scale: 1,
            },
            {
              scale: 1.4,
              duration: 1,
              clearProps: "all",
            },
            0
          );

          tl.fromTo(
            prevSlide.querySelector(".intro__slider-card-title"),
            {
              y: 0,
            },
            {
              y: -60,
              duration: 1,
              clearProps: "all",
            },
            0
          );
          tl.fromTo(
            nextSlide.querySelector(".intro__slider-card-title"),
            {
              y: 60,
            },
            {
              y: 0,
              duration: 1,
            },
            0
          );
        },
      },
    });
  });
}
