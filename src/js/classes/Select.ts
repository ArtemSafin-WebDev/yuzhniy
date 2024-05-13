class Select {
  private isOpen = false;
  private btn: HTMLButtonElement | null;
  private btnTextElement: HTMLSpanElement | null = null;
  private choices: HTMLInputElement[];
  private placeholderText: string = "";
  constructor(private element: HTMLElement) {
    this.element = element;
    this.btn = this.element.querySelector<HTMLButtonElement>(
      'button[type="button"]'
    );
    if (this.btn) {
      this.btnTextElement =
        this.btn.querySelector<HTMLSpanElement>(".js-btn-text");
    }
    this.choices = Array.from(
      this.element.querySelectorAll<HTMLInputElement>('input[type="radio"]')
    );
    document.documentElement.addEventListener("click", this.handleOutsideClick);
    this.btn?.addEventListener("click", this.handleBtnClick);

    this.choices.forEach((choice) =>
      choice.addEventListener("change", this.handleSelection)
    );

    const dataPlaceholder = this.element.getAttribute("data-placeholder");

    if (dataPlaceholder) {
      this.placeholderText = dataPlaceholder;
    }

    this.handleSelection();
  }

  public open = () => {
    if (this.isOpen) return;
    this.element.classList.add("active");
    this.isOpen = true;
  };

  public close = () => {
    if (!this.isOpen) return;
    this.element.classList.remove("active");
    this.isOpen = false;
  };

  private handleBtnClick = (event: MouseEvent) => {
    event.preventDefault();
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  };

  private handleSelection = () => {
    if (!this.choices.length) return;
    let activeChoice = this.choices.find((choice) => choice.checked);

    if (activeChoice) {
      if (activeChoice.value.trim()) {
        this.element.classList.add("choice-selected");
        const textElement =
          activeChoice.parentElement?.querySelector("span:last-of-type");

        if (textElement && this.btnTextElement) {
          this.btnTextElement.textContent = textElement.textContent;
        }
      } else {
        this.element.classList.remove("choice-selected");
      }
    } else {
      this.element.classList.remove("choice-selected");
      if (this.btnTextElement) {
        this.btnTextElement.textContent = this.placeholderText;
      }
    }

    this.close();
  };

  private handleOutsideClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (this.element.contains(target)) return;
    this.close();
  };

  public destroy() {
    document.documentElement.removeEventListener(
      "click",
      this.handleOutsideClick
    );
    this.choices.forEach((choice) =>
      choice.removeEventListener("change", this.handleSelection)
    );
    this.btn?.removeEventListener("click", this.handleBtnClick);
  }
}

export default Select;
