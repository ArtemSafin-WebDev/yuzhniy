import axios from "axios";
import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function mapDetail() {
  const catalogModal = document.querySelector<HTMLElement>("#catalog-modal");
  if (!catalogModal) return;
  const controller = new AbortController();
  document.addEventListener("click", async (event) => {
    const target = event.target as HTMLElement;
    console.log("Target", target);
    if (
      target.matches(".map__popover-more") ||
      target.closest(".map__popover-more")
    ) {
      event.preventDefault();

      console.log("Clicked");
      const link = (
        target.matches(".map__popover-more")
          ? target
          : target.closest(".map__popover-more")
      ) as HTMLLinkElement;

      if (!link) return;

      const url = link.href;

      try {
        const response = await axios.get(url, {
          signal: controller.signal,
        });
        const data = response.data;
        const parser = new DOMParser();
        const nextPageHtml = parser.parseFromString(data, "text/html");
        const nextModal = nextPageHtml.querySelector<HTMLElement>(
          ".catalog-detail .modal__catalog"
        );

        const currentModalContent =
          catalogModal.querySelector<HTMLElement>(".modal__catalog");

        console.log("Next modal", nextPageHtml);

        if (currentModalContent && nextModal) {
          currentModalContent.innerHTML = "";

          currentModalContent.replaceWith(nextModal);

          catalogModal.classList.add("active");
          document.body.classList.add("modal-open");

          const slider = catalogModal.querySelector<HTMLElement>(
            ".modal__catalog-promo-slider"
          );

          console.log("Slider", slider);

          const showMoreBtn = catalogModal.querySelector<HTMLButtonElement>(
            ".modal__catalog-text-content-show-more"
          );

          if (slider) {
            const container = slider.querySelector<HTMLElement>(".swiper");
            if (!container) return;

            new Swiper(container, {
              slidesPerView: "auto",
              speed: 600,
              modules: [Navigation],
              navigation: {
                prevEl: slider.querySelector<HTMLButtonElement>(
                  ".modal__catalog-promo-arrow--prev"
                ),
                nextEl: slider.querySelector<HTMLButtonElement>(
                  ".modal__catalog-promo-arrow--next"
                ),
              },
            });
          }

          if (showMoreBtn) {
            showMoreBtn.addEventListener("click", (event) => {
              event.preventDefault();
              showMoreBtn.parentElement?.classList.toggle("show-all");
            });
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
  });
}
