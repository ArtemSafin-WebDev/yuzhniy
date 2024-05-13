export default function fileUpload() {
  const elements = Array.from(document.querySelectorAll(".js-file-upload"));

  console.log(elements);

  elements.forEach((element) => {
    const input = element.querySelector<HTMLInputElement>('input[type="file"]');
    const label = element.querySelector(".js-file-upload-text");
    const form = element.closest<HTMLFormElement>("form");
    const clearBtn = element.querySelector<HTMLButtonElement>(
      ".js-file-upload-clear"
    );

    if (!input || !label || !form) return;

    const originalLabelText = label.textContent;

    input.addEventListener("change", () => {
      if (input.files && input.files.length) {
        label.textContent = input.files[0].name;
        element.classList.add("file-loaded");
      } else {
        element.classList.remove("file-loaded");
      }
    });

    input.addEventListener("dragenter", () => {
      element.classList.add("dragged");
    });
    input.addEventListener("dragend", () => {
      element.classList.remove("dragged");
    });
    input.addEventListener("dragleave", () => {
      element.classList.remove("dragged");
    });
    input.addEventListener("drop", () => {
      element.classList.remove("dragged");
    });

    if (form) {
      form.addEventListener("reset", () => {
        input.value = "";
        label.textContent = originalLabelText;
        element.classList.remove("file-loaded");
        element.classList.remove("dragged");
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener("click", (event) => {
        event.preventDefault();
        input.value = "";
        label.textContent = originalLabelText;
        element.classList.remove("file-loaded");
        element.classList.remove("dragged");
        input.dispatchEvent(new Event("change"));
      });
    }
  });
}
