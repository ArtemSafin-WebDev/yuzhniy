import ShowMap from "./classes/ShopMap";

export default function showMap() {
  const elements = Array.from(
    document.querySelectorAll<HTMLElement>(".js-shop-map")
  );

  elements.forEach((element) => {
    const mapInstance = new ShowMap(element);
    mapInstance.init();
  });
}
