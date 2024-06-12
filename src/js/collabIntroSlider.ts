import Swiper from "swiper";
import { SwiperOptions, Swiper as SwiperInstance } from "swiper/types";
import "swiper/css";

export default function collabIntroSlider() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".js-collab-intro-slider")
  );

  elements.forEach((element) => {
    const container = element.querySelector<HTMLElement>(".swiper");
    if (!container) return;
    const mql = window.matchMedia("(max-width: 640px)");
    const options: SwiperOptions = {
      slidesPerView: "auto",
      speed: 600,
    };

    let instance: SwiperInstance | null = null;

    const handleWidthChange = (e: MediaQueryListEvent | MediaQueryList) => {
      if (instance) {
        instance.destroy();
        instance = null;
      }
      if (e.matches) {
        instance = new Swiper(container, options);
      }
    };

    mql.addEventListener("change", handleWidthChange);

    handleWidthChange(mql);
  });
}
