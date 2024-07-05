document.addEventListener("DOMContentLoaded", () => {
  window.getAreaCoords = (element) => {
    const parentSvg = element.closest("svg");

    const yOffset =
      element.getBoundingClientRect().top + element.offsetHeight / 2;
    const xOffset = element.offsetLeft + element.offsetWidth / 2;

    return {
      xPos: (xOffset / parentSvg.offsetWidth) * 100,
      yPos: (yOffset / parentSvg.offsetHeight) * 100,
    };
  };
});
