import Validator from "./classes/Validator";
import axios from "axios";

export default function forms() {
  const forms = Array.from<HTMLFormElement>(
    document.querySelectorAll(".js-form")
  );

  forms.forEach((form) => {
    const formValidator = new Validator(form);
    const controller = new AbortController();
    const submitBtn = form.querySelector<HTMLButtonElement>(
      'button[type="submit"]'
    );

    const success = document.querySelector<HTMLElement>(
      "#callback-modal-success"
    );
    const error = document.querySelector<HTMLElement>("#callback-modal-error");

    const handleFormSubmit = (event: SubmitEvent) => {
      event.preventDefault();
      if (!formValidator || !form) return;
      formValidator.validate();

      console.log("Validated", formValidator.valid);

      if (formValidator.valid) {
        const formData = new FormData(form);
        if (submitBtn) submitBtn.disabled = true;
        axios
          .post(form.action, formData, {
            signal: controller.signal,
            headers: {
              "Content-Type": "multipart/form-data",
            },
          })
          .then((res) => {
            console.log(res.data);
            success?.classList.add("active");
            document.body.classList.add("menu-open");
          })
          .catch((err) => {
            console.error(err);
            error?.classList.add("active");
            document.body.classList.add("menu-open");
          })
          .finally(() => {
            if (submitBtn) submitBtn.disabled = false;
          });
      }
    };
    form.addEventListener("submit", handleFormSubmit);
  });
}
