import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";

export default function modalCalendar() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".js-modal-calendar")
  );

  elements.forEach((element) => {
    const input = element.querySelector("input");
    if (!input) return;

    const datesText = element.querySelector<HTMLElement>(
      ".modal__calendar-btn-text-inner"
    );

    const resetBtns = Array.from(
      element.querySelectorAll<HTMLButtonElement>(".js-reset-datepicker")
    );

    const closeBtns = Array.from(
      element.querySelectorAll<HTMLElement>(".js-close-datepicker")
    );

    const dates = element.querySelector<HTMLElement>(".modal__calendar-btn");

    const modal = element.querySelector<HTMLElement>(
      ".modal__calendar-dropdown"
    );

    const placeholderText = element.getAttribute("data-placeholder-text");

    const instance = new AirDatepicker(input, {
      inline: true,
      range: false,
      onSelect: ({ formattedDate }) => {
        const joinedDate = formattedDate as string;
        console.log("Formatted date", joinedDate);
        const event = new Event("input");

        input.dispatchEvent(event);
        if (!datesText) return;

        if (!joinedDate) {
          datesText.textContent = placeholderText;
          element.classList.remove("date-selected");
        } else {
          datesText.textContent = joinedDate;
          element.classList.add("date-selected");
        }
      },
      multipleDatesSeparator: " - ",
      prevHtml: `<svg width="30" height="30" viewBox="0 0 30 30"  xmlns="http://www.w3.org/2000/svg">
      <path
          d="M7.52942 14.9999C7.52942 14.6236 7.67312 14.2473 7.95993 13.9603L16.9895 4.9308C17.5639 4.3564 18.4952 4.3564 19.0694 4.9308C19.6435 5.50496 19.6435 6.43606 19.0694 7.0105L11.0795 14.9999L19.0691 22.9894C19.6433 23.5638 19.6433 24.4948 19.0691 25.0689C18.4949 25.6436 17.5637 25.6436 16.9893 25.0689L7.95965 16.0396C7.6728 15.7525 7.52942 15.3762 7.52942 14.9999Z"
           />
      <path fill-rule="evenodd" clip-rule="evenodd"
          d="M18.9987 5.00149C18.4636 4.46618 17.5956 4.46616 17.0602 5.00151L8.03065 14.031C8.03065 14.031 8.03066 14.031 8.03065 14.031C7.76335 14.2985 7.62942 14.649 7.62942 14.9999C7.62942 15.3507 7.76303 15.7013 8.03036 15.9688C8.03037 15.9688 8.03035 15.9688 8.03036 15.9688L17.06 24.9982C17.5953 25.5338 18.4633 25.5338 18.9984 24.9983C19.5334 24.4632 19.5335 23.5955 18.9984 23.0601C18.9984 23.0601 18.9984 23.0601 18.9984 23.0601L10.9381 14.9999L18.9986 6.93981C18.9987 6.9398 18.9986 6.93981 18.9986 6.93981C19.5338 6.4044 19.5337 5.53659 18.9987 5.00149ZM19.0694 7.0105C19.6435 6.43606 19.6435 5.50496 19.0694 4.9308C18.4952 4.3564 17.5639 4.3564 16.9895 4.9308L7.95993 13.9603C7.67312 14.2473 7.52942 14.6236 7.52942 14.9999C7.52942 15.3762 7.6728 15.7525 7.95965 16.0396L16.9893 25.0689C17.5637 25.6436 18.4949 25.6436 19.0691 25.0689C19.6433 24.4948 19.6433 23.5638 19.0691 22.9894L11.0795 14.9999L19.0694 7.0105Z"
           />
  </svg>`,
      nextHtml: `
  <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
    <path
        d="M22.4706 15.0001C22.4706 15.3764 22.3269 15.7527 22.0401 16.0397L13.0105 25.0692C12.4361 25.6436 11.5048 25.6436 10.9306 25.0692C10.3565 24.495 10.3565 23.5639 10.9306 22.9895L18.9205 15.0001L10.9309 7.01059C10.3567 6.43619 10.3567 5.50519 10.9309 4.93107C11.5051 4.3564 12.4363 4.3564 13.0107 4.93107L22.0404 13.9604C22.3272 14.2475 22.4706 14.6238 22.4706 15.0001Z" />
    <path fill-rule="evenodd" clip-rule="evenodd"
        d="M11.0013 24.9985C11.5364 25.5338 12.4044 25.5338 12.9398 24.9985L21.9693 15.969C21.9694 15.969 21.9693 15.969 21.9693 15.969C22.2367 15.7015 22.3706 15.351 22.3706 15.0001C22.3706 14.6493 22.237 14.2987 21.9696 14.0312C21.9696 14.0312 21.9697 14.0312 21.9696 14.0312L12.94 5.00178C12.4047 4.46618 11.5367 4.46618 11.0016 5.00175C10.4666 5.5368 10.4665 6.40452 11.0016 6.93987C11.0016 6.93988 11.0016 6.93987 11.0016 6.93987L19.0619 15.0001L11.0013 23.0602C11.0013 23.0602 11.0014 23.0602 11.0013 23.0602C10.4662 23.5956 10.4663 24.4634 11.0013 24.9985ZM10.9306 22.9895C10.3565 23.5639 10.3565 24.495 10.9306 25.0692C11.5048 25.6436 12.4361 25.6436 13.0105 25.0692L22.0401 16.0397C22.3269 15.7527 22.4706 15.3764 22.4706 15.0001C22.4706 14.6238 22.3272 14.2475 22.0404 13.9604L13.0107 4.93107C12.4363 4.3564 11.5051 4.3564 10.9309 4.93107C10.3567 5.50519 10.3567 6.43619 10.9309 7.01059L18.9205 15.0001L10.9306 22.9895Z" />
</svg>`,
    });

    resetBtns.forEach((btn) =>
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        instance.clear();

        instance.update();
      })
    );

    dates?.addEventListener("click", () => {
      element.classList.toggle("active");
    });

    closeBtns.forEach((btn) =>
      btn.addEventListener("click", () => {
        element.classList.remove("active");
      })
    );

    modal?.addEventListener("click", function (event) {
      if (event.target === this) {
        element.classList.remove("active");
      }
    });

    document.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (
        target.matches(".js-modal-calendar") ||
        target.closest(".js-modal-calendar")
      )
        return;
      element.classList.remove("active");
    });
  });
}
