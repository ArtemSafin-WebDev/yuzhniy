import { Panzoom } from "@fancyapps/ui";
import "@fancyapps/ui/dist/panzoom/panzoom.css";

import { Pins } from "@fancyapps/ui/dist/panzoom/panzoom.pins.esm.js";
import "@fancyapps/ui/dist/panzoom/panzoom.pins.css";

type Point = {
  title: string;
  popoverIcon: string;
  tags: string[];
  area: string;
  mapIcon?: {
    width: number;
    url: string;
  };
  xPos: number;
  yPos: number;
  detailsUrl: string;
  floor: number;
};

type Category = {
  title: string;
  icon: string;
  subcategories: Array<{
    title: string;
    count?: number;
  }>;
};

type PointsData = {
  points: Point[];
  categories: Category[];
};

export default class ShopMap {
  private rootElement: HTMLElement;
  private searchInput: HTMLInputElement | null = null;
  private minusBtn: HTMLButtonElement | null = null;
  private plusBtn: HTMLButtonElement | null = null;
  private floorsBtns: HTMLButtonElement[] = [];
  private searchText = "";
  private floorIndex = 1;
  private areas: SVGAElement[] = [];
  private popovers: HTMLElement[] = [];
  private container: HTMLElement | null = null;
  private panZoomInstance: Panzoom | null = null;
  private popoverContainer: HTMLElement | null = null;
  private floorOnePointsContainer: HTMLElement | null = null;
  private secondFloorPointsContainer: HTMLElement | null = null;
  private points: HTMLElement[] = [];
  private dataUrl: string | null = null;
  private showCategoriesBtn: HTMLButtonElement | null = null;
  private categoriesWrapper: HTMLElement | null = null;
  private floors: HTMLElement[] = [];
  private moving: boolean = false;

  private categorySelected = false;
  private filteredBySubcategory = false;
  private backBtn: HTMLElement | null = null;
  private categoryTitleTextElement: HTMLElement | null = null;
  private categories: Category[] = [];
  private searchWrapper: HTMLElement | null = null;
  private selectedCategoryWrapper: HTMLElement | null = null;
  private subcategoriesWrapper: HTMLElement | null = null;
  private subcategoriesInner: HTMLElement | null = null;
  private resultsWrapper: HTMLElement | null = null;
  private resultsInner: HTMLElement | null = null;
  private resultsFloorFilters: HTMLElement[] = [];

  private pointsData: Point[] = [];
  private prevMainCategory = "";
  private pointsFilteredByCategory: Point[] = [];
  private mobilePopoversWrapper: HTMLElement | null = null;
  private mobilePopovers: HTMLElement[] = [];
  private catalogSearchInput: HTMLInputElement | null = null;

  private catalogCategories: HTMLLinkElement[] = [];
  private catalogMobileCategories: HTMLLinkElement[] = [];

  constructor(element: HTMLElement) {
    this.rootElement = element;
    this.searchInput = this.rootElement.querySelector<HTMLInputElement>(
      ".map__selector-search-input"
    );

    this.dataUrl = this.rootElement.hasAttribute("data-url")
      ? this.rootElement.getAttribute("data-url")
      : null;
    this.container =
      this.rootElement.querySelector<HTMLElement>(".map__pane-inner")!;
    this.popoverContainer =
      this.rootElement.querySelector<HTMLElement>(".map__container");
    this.floorOnePointsContainer = this.rootElement.querySelector<HTMLElement>(
      ".map__first-floor .map__points"
    );
    this.secondFloorPointsContainer =
      this.rootElement.querySelector<HTMLElement>(
        ".map__second-floor .map__points"
      );
    this.minusBtn = this.rootElement.querySelector<HTMLButtonElement>(
      ".map__zoom-btn--minus"
    );
    this.mobilePopoversWrapper = this.rootElement.querySelector(
      ".map__mobile-popovers"
    );
    this.plusBtn = this.rootElement.querySelector<HTMLButtonElement>(
      ".map__zoom-btn--plus"
    );
    this.floorsBtns = Array.from(
      this.rootElement.querySelectorAll<HTMLButtonElement>(".map__floor-btn")
    );

    this.resultsInner = this.rootElement.querySelector(
      ".map__selector-results-inner"
    );

    this.catalogCategories = Array.from(
      document.querySelectorAll(".catalog__categories-accordion-link")
    );

    this.catalogMobileCategories = Array.from(
      document.querySelectorAll(".catalog__block-subcategories-link")
    );

    this.categoryTitleTextElement = this.rootElement.querySelector<HTMLElement>(
      ".map__selector-selected-category-text-inner span"
    );
    this.backBtn = this.rootElement.querySelector<HTMLElement>(
      ".map__selector-selected-category-back"
    );

    this.catalogSearchInput = document.querySelector(".catalog__search-input");

    this.subcategoriesInner = this.rootElement.querySelector<HTMLElement>(
      ".map__selector-subcategories-inner"
    );

    this.resultsFloorFilters = Array.from(
      this.rootElement.querySelectorAll(".map__selector-floors-filters-btn")
    );

    this.resultsWrapper = this.rootElement.querySelector<HTMLElement>(
      ".map__selector-results"
    );

    this.searchWrapper = this.rootElement.querySelector(
      ".map__selector-search-wrapper"
    );

    this.selectedCategoryWrapper = this.rootElement.querySelector(
      ".map__selector-selected-category-wrapper"
    );

    this.subcategoriesWrapper = this.rootElement.querySelector<HTMLElement>(
      ".map__selector-subcategories"
    );

    this.areas = Array.from(
      this.rootElement.querySelectorAll<SVGAElement>("svg a")
    );

    this.showCategoriesBtn = this.rootElement.querySelector<HTMLButtonElement>(
      ".js-show-categories"
    );
    this.categoriesWrapper = this.rootElement.querySelector<HTMLElement>(
      ".map__selector-categories"
    );

    this.floors = [
      this.rootElement.querySelector(".map__zero-floor")!,
      this.rootElement.querySelector(".map__first-floor")!,
      this.rootElement.querySelector(".map__second-floor")!,
    ];
  }

  private setFloorFilters = (index: number) => {
    this.resultsFloorFilters?.forEach((btn) => btn.classList.remove("active"));
    this.resultsFloorFilters[index]?.classList.add("active");
  };

  private generatePointMarkup = (point: Point) => {
    const div = document.createElement("div");
    div.classList.add("map__point");
    div.setAttribute("data-area", point.area);
    div.setAttribute("data-name", point.title.trim().toLowerCase());
    div.setAttribute("data-floor", point.floor.toString());

    if (point.mapIcon?.width)
      div.style.setProperty("--icon-width", point.mapIcon.width.toString());
    div.style.setProperty("--x-pos", point.xPos.toString() + "%");
    div.style.setProperty("--y-pos", point.yPos.toString() + "%");
    if (point.mapIcon?.url) {
      const icon = new Image();
      icon.classList.add("map__point-icon");
      icon.src = point.mapIcon.url;
      div.append(icon);
    } else {
      const placeholder = document.createElement("div");
      placeholder.classList.add("map__point-icon-placeholder");
      div.append(placeholder);
    }

    return div;
  };

  private generatePopoverMarkup = (point: Point) => {
    const popover = document.createElement("div");
    popover.classList.add("map__popover");
    popover.setAttribute("data-panzoom-pin", "");
    popover.setAttribute("data-x", `${point.xPos}%`);
    popover.setAttribute("data-y", `${point.yPos}%`);
    popover.setAttribute("data-area", point.area);
    popover.setAttribute("data-name", point.title.trim().toLowerCase());
    popover.setAttribute("data-floor", point.floor.toString());

    popover.innerHTML = `
    <div class="map__popover-inner">
        <button class="map__popover-close">
            <svg width="14" height="14" aria-hidden="true">
                <use xlink:href="#popover-close"></use>
            </svg>
        </button>
        ${
          point.popoverIcon
            ? `
            <div class="map__popover-icon-wrapper">
              <img src="${point.popoverIcon}" alt="" class="map__popover-icon">
            </div>
          `
            : ""
        }
        <h4 class="map__popover-title">
            ${point.title}
        </h4>
        ${
          point.tags
            ? `
            <ul class="map__popover-tags-list">
              ${point.tags
                .map(
                  (tag) => `
                <li class="map__popover-tags-list-item">
                  ${tag}
                </li>`
                )
                .join("")}
            </ul>
          `
            : ""
        }
        <a href="${point.detailsUrl}" class="map__popover-more">Подробнее</a>
    </div>
    `;
    return popover;
  };

  private generateMobilePopoverMarkup = (point: Point) => {
    const popover = document.createElement("div");
    popover.classList.add("map__mobile-popover");

    popover.setAttribute("data-x", `${point.xPos}%`);
    popover.setAttribute("data-y", `${point.yPos}%`);
    popover.setAttribute("data-area", point.area);
    popover.setAttribute("data-name", point.title.trim().toLowerCase());
    popover.setAttribute("data-floor", point.floor.toString());
    popover.innerHTML = `
    <div class="map__mobile-popover-inner">
        <button class="map__mobile-popover-close">
            <svg width="14" height="14" aria-hidden="true">
                <use xlink:href="#popover-close"></use>
            </svg>
        </button>
        ${
          point.popoverIcon
            ? `
            <div class="map__mobile-popover-icon-wrapper">
              <img src="${point.popoverIcon}" alt="" class="map__mobile-popover-icon">
            </div>
          `
            : ""
        }
        <div class="map__mobile-popover-wrapper">
        <h4 class="map__mobile-popover-title">
            ${point.title}
        </h4>
        ${
          point.tags
            ? `
            <ul class="map__mobile-popover-tags-list">
              ${point.tags
                .map(
                  (tag) => `
                <li class="map__mobile-popover-tags-list-item">
                  ${tag}
                </li>`
                )
                .join("")}
            </ul>
          `
            : ""
        }
        <a href="${point.detailsUrl}" class="map__popover-more">Подробнее</a>
        </div>
    </div>
    `;
    return popover;
  };

  public init = async () => {
    if (!this.dataUrl) throw new Error("Data URL not provided");
    let point: Point[] = [];
    let categories: Category[] = [];
    try {
      const response = await fetch(this.dataUrl);
      const json = (await response.json()) as PointsData;
      point = json.points;
      categories = json.categories;
      this.categories = categories;
      this.pointsData = point;
    } catch (err) {
      console.error(err);
      return;
    }

    const notEmptyCategories = categories
      .filter((cat) => {
        const subCatNames = Array.from(
          new Set(cat.subcategories.map((cat) => cat.title))
        );

        const hasAnyPoints = this.pointsData.filter((point) => {
          return point.tags.some((tag) => subCatNames.includes(tag));
        });

        return hasAnyPoints.length;
      })
      .map((cat) => {
        const newCat = cat;
        newCat.subcategories = newCat.subcategories.filter((subcat) =>
          this.pointsData.some((point) => point.tags.includes(subcat.title))
        );
        newCat.subcategories = newCat.subcategories.map((subcat) => {
          const count = this.pointsData.filter((point) =>
            point.tags.includes(subcat.title)
          ).length;
          if (count !== 0) {
            subcat.count = count;
          } else {
            delete subcat.count;
          }

          return subcat;
        });
        return newCat;
      });

    this.categories = notEmptyCategories;

    console.log("Not empty categories", notEmptyCategories);

    console.log(point);
    const firstFloorPointsData = point.filter((point) => point.floor === 1);
    const firstFloorPoints = firstFloorPointsData.map((point) =>
      this.generatePointMarkup(point)
    );
    this.floorOnePointsContainer?.append(...firstFloorPoints);

    const secondFloorPointsData = point.filter((point) => point.floor === 2);
    const secondFloorPoints = secondFloorPointsData.map((point) =>
      this.generatePointMarkup(point)
    );
    this.secondFloorPointsContainer?.append(...secondFloorPoints);

    const popovers = point.map((point) => this.generatePopoverMarkup(point));

    this.popoverContainer?.append(...popovers);

    const mobilePopovers = point.map((point) =>
      this.generateMobilePopoverMarkup(point)
    );

    this.mobilePopoversWrapper?.append(...mobilePopovers);

    this.popovers = Array.from(
      this.rootElement.querySelectorAll<HTMLElement>(".map__popover")
    );

    this.mobilePopovers = Array.from(
      this.rootElement.querySelectorAll<HTMLElement>(".map__mobile-popover")
    );

    this.points = Array.from(
      this.rootElement.querySelectorAll<HTMLElement>(".map__point")
    );

    const categoriesUl = document.createElement("ul");
    categoriesUl.className = "map__selector-categories-list";
    this.categoriesWrapper?.append(categoriesUl);

    categories.forEach((category) => {
      const categoryItem = document.createElement("li");
      categoryItem.classList.add("map__selector-categories-list-item");
      const categoryCard = document.createElement("a");
      categoryCard.classList.add("map__selector-categories-card");
      categoryCard.innerHTML = `
        <div class="map__selector-categories-card-icon-wrapper">
          <img class="map__selector-categories-card-icon" src=${category.icon} />
        </div>
        <div class="map__selector-categories-card-title">
          ${category.title}
        </div>
      `;
      categoryCard.href = "#";
      categoryCard.setAttribute("data-category-title", category.title);
      categoryItem.append(categoryCard);
      categoriesUl.append(categoryItem);
    });

    this.setListeners();

    this.setFloor(this.floorIndex);

    this.panZoomInstance = new Panzoom(
      document.querySelector("#myPanzoom"),
      {
        click: false,

        // minScale: 1,
        maxScale: 10,
        // panOnlyZoomed: false,
        wheel: window.matchMedia("(max-width: 640px)").matches ? "zoom" : false,
        width: () => {
          return this.container ? this.container.offsetWidth : 0;
        },
        height: () => {
          return this.container ? this.container.offsetHeight : 0;
        },
        on: {
          startAnimation: () => {
            this.moving = true;
          },
          endAnimation: () => {
            this.moving = false;
          },
          touchEnd: () => {
            this.moving = false;
          },
          // touchMove: () => {
          //   this.closePopover();
          // },
        },
      },
      { Pins }
    );

    if (
      window.matchMedia("(max-width: 640px)").matches &&
      this.rootElement.closest(".catalog")
    ) {
      this.panZoomInstance.zoomTo(6);
    }

    this.openPopoverByURL();
  };

  setFloor = (index: number, close?: boolean) => {
    if (close) this.closePopover();
    this.floorIndex = index;
    this.floorsBtns.forEach((btn) => btn.classList.remove("active"));
    this.floorsBtns[index]?.classList.add("active");
    this.floors.forEach((floor) => floor.classList.remove("active"));
    this.floors[index]?.classList.add("active");

    if (this.panZoomInstance) {
      this.panZoomInstance.updateMetrics();
    }
  };

  setSearch = (q: string) => {
    this.searchText = q.trim();
    if (this.searchText) {
      this.enterSearch(this.searchText);
    } else {
      this.exitSearch();
    }
  };

  handleCatalogSearch = () => {
    this.resetFilterCatalog();
    if (!this.catalogSearchInput) return;
    const value = this.catalogSearchInput.value.trim().toLowerCase();
    if (!value) {
      this.closePopover();
      return;
    }

    let searchResults = this.pointsData.filter((item) => {
      return item.title.trim().toLowerCase().startsWith(value);
    });

    if (!searchResults.length) {
      this.closePopover();
      return;
    }

    const firstResult = searchResults[0];
    const name = firstResult.title;

    this.openPopoverByName(name);
  };

  openPopover = (id: string) => {
    this.popovers.forEach((popover) => popover.classList.remove("active"));
    const popover = document.querySelector(`.map__popover[data-area="${id}"]`);
    popover?.classList.add("active");
    this.mobilePopovers.forEach((popover) =>
      popover.classList.remove("active")
    );
    const mobilePopover = document.querySelector(
      `.map__mobile-popover[data-area="${id}"]`
    );
    mobilePopover?.classList.add("active");

    this.points.forEach((point) => point.classList.remove("active"));
    const point = this.points.find(
      (point) => point.getAttribute("data-area") === id
    );
    point?.classList.add("active");

    this.areas.forEach((area) => area.classList.remove("active"));
    const area = this.areas.find((area) => area.id === id);
    area?.classList.add("active");
  };

  filterCatalog = (category: string) => {
    const matchingItems = this.pointsData.filter((item) =>
      item.tags.includes(category)
    );
    const matchingPoints = this.points.filter((point) => {
      const pointName = point.getAttribute("data-name");
      if (!pointName) return false;
      const correspondingPoint = matchingItems.find(
        (item) =>
          item.title.toLowerCase().trim() === pointName.toLowerCase().trim()
      );
      if (correspondingPoint) {
        return true;
      } else {
        return false;
      }
    });

    const matchingAreas = this.areas.filter((area) => {
      const areaId = area.id;
      const correspondingPoints = matchingPoints.filter((point) => {
        const pointAreaId = point.getAttribute("data-area");
        if (pointAreaId === areaId) {
          return true;
        } else {
          return false;
        }
      });
      if (correspondingPoints.length > 0) {
        return true;
      } else {
        return false;
      }
    });

    this.points.forEach((point) => point.classList.add("dimmed"));
    this.areas.forEach((area) => area.classList.add("dimmed"));
    matchingPoints.forEach((point) => point.classList.remove("dimmed"));
    matchingAreas.forEach((area) => area.classList.remove("dimmed"));
  };

  setQueryString = (value: string) => {
    const baseUrl = [
      window.location.protocol,
      "//",
      window.location.host,
      window.location.pathname,
    ].join("");
    let params = new URLSearchParams(window.location.search);
    params.set("map_title", value);
    window.history.replaceState({}, "Title", `${baseUrl}?${params.toString()}`);
  };

  clearQueryString() {
    const baseUrl = [
      window.location.protocol,
      "//",
      window.location.host,
      window.location.pathname,
    ].join("");
    window.history.replaceState({}, "Title", `${baseUrl}`);
  }

  resetFilterCatalog = () => {
    this.catalogCategories.forEach((category) =>
      category.classList.remove("active")
    );
    this.catalogMobileCategories.forEach((category) =>
      category.classList.remove("active")
    );
    this.points.forEach((point) => point.classList.remove("dimmed"));
    this.areas.forEach((area) => area.classList.remove("dimmed"));
  };

  selectMainCategory = (category: string) => {
    this.categorySelected = true;
    if (this.searchWrapper) this.searchWrapper.style.display = "none";
    if (this.selectedCategoryWrapper)
      this.selectedCategoryWrapper.style.display = "";
    if (this.categoryTitleTextElement)
      this.categoryTitleTextElement.textContent = category.trim();
    this.prevMainCategory = category;

    const subcategories = this.categories.find(
      (someCategory) =>
        someCategory.title.trim().toLowerCase() ===
        category.trim().toLowerCase()
    )?.subcategories;

    const cards = subcategories?.map((subcategory) => {
      const subcategoryCard = document.createElement("a");
      subcategoryCard.href = "#";
      subcategoryCard.classList.add("map__selector-subcategories-card");
      subcategoryCard.innerHTML = `
        <div class="map__selector-subcategories-card-title">
          ${subcategory.title}
        </div>
        ${
          subcategory.count
            ? `
            <div class="map__selector-subcategories-card-count">
              ${subcategory.count}
            </div>`
            : ""
        }
       
      `;
      subcategoryCard.setAttribute("data-subcategory-title", subcategory.title);
      return subcategoryCard;
    });

    const ul = document.createElement("ul");
    ul.classList.add("map__selector-subcategories-list");

    cards?.forEach((card) => {
      const li = document.createElement("li");
      li.classList.add("map__selector-subcategories-list-item");
      li.appendChild(card);
      ul.appendChild(li);
    });

    if (this.categoriesWrapper) this.categoriesWrapper.style.display = "none";
    if (this.subcategoriesWrapper) this.subcategoriesWrapper.style.display = "";
    console.log("Subcategories", subcategories);

    if (this.subcategoriesInner) {
      this.subcategoriesInner.appendChild(ul);
    }
  };

  openPopoverByName = (name: string) => {
    this.popovers.forEach((popover) => popover.classList.remove("active"));
    const popover = document.querySelector(
      `.map__popover[data-name="${name.trim().toLowerCase()}"]`
    );
    this.mobilePopovers.forEach((popover) =>
      popover.classList.remove("active")
    );
    const mobilePopover = document.querySelector(
      `.map__mobile-popover[data-name="${name.trim().toLowerCase()}"]`
    );

    const floor = Number(popover?.getAttribute("data-floor"));
    this.setFloor(floor, true);
    const id = popover?.getAttribute("data-area");
    popover?.classList.add("active");
    mobilePopover?.classList.add("active");

    // this.points.forEach((point) => point.classList.remove("active"));
    // const point = this.points.find(
    //   (point) => point.getAttribute("data-name") === name.trim().toLowerCase()
    // );
    this.points.forEach((point) => point.classList.remove("active"));
    const points = this.points.filter(
      (point) => point.getAttribute("data-area") === id
    );
    points.forEach((point) => point.classList.add("active"));
    // point?.classList.add("active");
    this.areas.forEach((area) => area.classList.remove("active"));
    const area = this.areas.find((area) => area.id === id);

    console.log("Area", area, id);
    area?.classList.add("active");

    if (this.rootElement.closest(".catalog")) {
      this.setQueryString(name);
    }

    // const objectToZoomIn = point;
    // const rect = objectToZoomIn?.getBoundingClientRect()!;
    // if (objectToZoomIn) {
    //   this.panZoomInstance?.panTo({
    //     x: window.innerWidth / 2 - (rect.left + rect?.width / 2),
    //     y: window.innerHeight / 2 - (rect.top + rect?.height / 2),
    //   });
    // }
  };

  openPopoverByURL = () => {
    const params = new URLSearchParams(location.search);
    console.log("Search params", params);

    const hasTitle = params.has("map_title");
    if (!hasTitle) return;

    const title = params.get("map_title");

    console.log("Map title", title);

    if (title) {
      this.openPopoverByName(title);
      const mapWrapper = document.querySelector(".map__wrapper");
      mapWrapper?.scrollIntoView(true);
    }
  };

  closePopover = () => {
    this.popovers.forEach((popover) => popover.classList.remove("active"));
    this.mobilePopovers.forEach((popover) =>
      popover.classList.remove("active")
    );
    this.points.forEach((point) => point.classList.remove("active"));
    this.areas.forEach((area) => area.classList.remove("active"));
    this.clearQueryString();
  };

  enterSearch = (text: string) => {
    if (this.resultsWrapper) this.resultsWrapper.style.display = "";
    if (this.subcategoriesWrapper)
      this.subcategoriesWrapper.style.display = "none";
    if (this.categoryTitleTextElement)
      this.categoryTitleTextElement.textContent = "";
    if (this.searchWrapper) this.searchWrapper.style.display = "";
    if (this.categoriesWrapper) this.categoriesWrapper.style.display = "none";
    let filteredByText = this.pointsData.filter((item) => {
      return item.title
        .trim()
        .toLowerCase()
        .includes(text.trim().toLowerCase());
    });
    this.resultsFloorFilters[0]?.parentElement?.classList.add("hidden");

    this.drawResults(filteredByText);
  };

  exitSearch = () => {
    if (this.searchWrapper) this.searchWrapper.style.display = "";
    this.resultsFloorFilters[0]?.parentElement?.classList.remove("hidden");
    if (this.subcategoriesWrapper)
      this.subcategoriesWrapper.style.display = "none";
    if (this.resultsWrapper) this.resultsWrapper.style.display = "none";
    if (this.categoriesWrapper) this.categoriesWrapper.style.display = "";
  };

  drawResults = (points: Point[]) => {
    if (!this.resultsInner) return;
    this.resultsInner.innerHTML = "";
    const ul = document.createElement("ul");
    ul.classList.add("map__selector-results-list");

    const pointsCards = points.map((point) => {
      const card = document.createElement("a");
      card.href = "#";
      card.classList.add("map__selector-results-card");
      card.setAttribute("data-name", point.title);
      card.setAttribute("data-floor", point.floor.toString());
      card.setAttribute("data-x", point.xPos.toString());
      card.setAttribute("data-y", point.yPos.toString());
      card.innerHTML = `
        <div class="map__selector-results-card-image-container">
          <img src=${point.popoverIcon} class="map__selector-results-card-image"/>
        </div>
        <div class="map__selector-results-card-title">
          ${point.title}
        </div>
      `;
      return card;
    });

    pointsCards.forEach((card) => {
      const li = document.createElement("li");
      li.classList.add("map__selector-results-list-item");
      li.appendChild(card);
      ul.appendChild(li);
    });

    this.resultsInner.appendChild(ul);
  };

  setListeners = () => {
    this.floorsBtns.forEach((btn, btnIndex) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        this.setFloor(btnIndex, true);
      });
    });

    this.searchInput?.addEventListener("input", (event) => {
      const target = event.target as HTMLInputElement;
      if (!target) return;
      this.setSearch(target.value);
    });

    this.areas.forEach((area) => {
      area.addEventListener("click", (event) => {
        event.preventDefault();
        if (this.moving) return;
        const id = area.id;
        const points = Array.from(
          document.querySelectorAll(`.map__point[data-area="${id}"]`)
        );

        const mouseX = event.clientX;
        const mouseY = event.clientY;

        const pointsWithDistances = points.map((point) => {
          const rect = point.getBoundingClientRect();
          const pointX = rect.left + rect.width / 2;
          const pointY = rect.top + rect.height / 2;

          const x = mouseX - pointX;
          const y = mouseY - pointY;

          const distance = Math.sqrt(x * x + y * y);

          return {
            point,
            distance,
          };
        });
        const pointsSortedByDistance = pointsWithDistances.sort((a, b) => {
          if (a.distance < b.distance) {
            return -1;
          } else if (a.distance > b.distance) {
            return 1;
          }
          return 0;
        });

        const closestPoint = pointsSortedByDistance[0];

        if (closestPoint) {
          const name = closestPoint?.point?.getAttribute("data-name");
          if (!name) return;
          this.openPopoverByName(name);
        }

        // console.log("Matching points", points);

        // console.log("id", id);
        // this.openPopover(id);
      });
    });

    this.minusBtn?.addEventListener("click", (event) => {
      event.preventDefault();
      this.panZoomInstance?.zoomOut(-1);
    });
    this.plusBtn?.addEventListener("click", (event) => {
      event.preventDefault();
      this.panZoomInstance?.zoomIn(2);
    });

    this.areas.forEach((area) => {
      area.addEventListener("mouseenter", () => {
        area.classList.add("hovered");

        const id = area.id;

        const points = Array.from(
          document.querySelectorAll(`[data-area="${id}"]`)
        );
        points.forEach((point) => point.classList.add("hovered"));
      });
      area.addEventListener("mouseleave", () => {
        area.classList.remove("hovered");
        const id = area.id;

        const points = Array.from(
          document.querySelectorAll(`[data-area="${id}"]`)
        );
        points.forEach((point) => point.classList.remove("hovered"));
      });
    });

    this.rootElement?.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (
        target.matches(".map__popover-close") ||
        target.closest(".map__popover-close")
      ) {
        this.closePopover();
      }
      if (
        target.matches(".map__mobile-popover-close") ||
        target.closest(".map__mobile-popover-close")
      ) {
        this.closePopover();
      }
    });

    this.showCategoriesBtn?.addEventListener("click", (event) => {
      event.preventDefault();
      if (this.rootElement.classList.contains("categories-shown")) {
        this.rootElement.classList.remove("categories-shown");
      } else {
        this.rootElement.classList.add("categories-shown");
      }
    });

    this.searchInput?.addEventListener("focus", () => {
      this.rootElement.classList.add("categories-shown");
    });

    // this.searchInput?.addEventListener("blur", () => {
    //   if (!this.searchInput?.value.trim()) {
    //     this.rootElement.classList.remove("categories-shown");
    //   }
    // });

    Array.from(
      this.rootElement.querySelectorAll(".map__selector-categories-card")
    ).forEach((categoryCard) => {
      categoryCard.addEventListener("click", (event) => {
        event.preventDefault();
        const title = categoryCard.getAttribute("data-category-title");
        if (!title) return;
        this.selectMainCategory(title);
      });
    });

    this.backBtn?.addEventListener("click", (event) => {
      event.preventDefault();

      if (this.categorySelected) {
        this.categorySelected = false;
        if (this.searchWrapper) this.searchWrapper.style.display = "";
        if (this.selectedCategoryWrapper)
          this.selectedCategoryWrapper.style.display = "none";
        if (this.categoryTitleTextElement)
          this.categoryTitleTextElement.textContent = "";
        if (this.categoriesWrapper) this.categoriesWrapper.style.display = "";
        if (this.subcategoriesWrapper)
          this.subcategoriesWrapper.style.display = "none";

        if (this.subcategoriesInner) {
          this.subcategoriesInner.innerHTML = "";
        }
      } else if (this.filteredBySubcategory) {
        console.log("Removing filtered by cat");
        if (this.searchWrapper) this.searchWrapper.style.display = "none";
        if (this.selectedCategoryWrapper)
          this.selectedCategoryWrapper.style.display = "";
        if (this.categoriesWrapper)
          this.categoriesWrapper.style.display = "none";
        if (this.subcategoriesWrapper)
          this.subcategoriesWrapper.style.display = "";
        if (this.resultsWrapper) this.resultsWrapper.style.display = "none";
        if (this.resultsInner) this.resultsInner.innerHTML = "";
        if (this.categoryTitleTextElement)
          this.categoryTitleTextElement.textContent = this.prevMainCategory;
        this.filteredBySubcategory = false;
        this.categorySelected = true;
      }
    });

    this.resultsFloorFilters.forEach((btn, btnIndex) => {
      btn.addEventListener("click", (event) => {
        event.preventDefault();
        this.setFloorFilters(btnIndex);
        if (this.pointsFilteredByCategory.length) {
          const pointsFilteredByCategoryAndFloor =
            this.pointsFilteredByCategory.filter(
              (point) => point.floor === btnIndex
            );
          this.drawResults(pointsFilteredByCategoryAndFloor);
        }
      });
    });

    this.rootElement.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (
        target.matches(".map__selector-subcategories-card") ||
        target.closest(".map__selector-subcategories-card")
      ) {
        event.preventDefault();
        const card = target.matches(".map__selector-subcategories-card")
          ? target
          : target.closest(".map__selector-subcategories-card");
        const subcategory = card?.getAttribute("data-subcategory-title");
        console.log("Subcategory selected", subcategory);
        if (!subcategory) return;
        if (this.resultsWrapper) this.resultsWrapper.style.display = "";
        if (this.subcategoriesWrapper)
          this.subcategoriesWrapper.style.display = "none";
        if (this.categoryTitleTextElement)
          this.categoryTitleTextElement.textContent = subcategory;
        let filteredBySubcategory = this.pointsData.filter((item) => {
          const tags = item.tags.map((tag) => tag.trim().toLowerCase());
          return tags.includes(subcategory?.trim().toLowerCase());
        });
        this.categorySelected = false;
        this.filteredBySubcategory = true;
        this.pointsFilteredByCategory = filteredBySubcategory;

        const availableFloors = Array.from(
          new Set(filteredBySubcategory.map((item) => item.floor))
        );

        console.log("available floors", availableFloors);

        this.resultsFloorFilters.forEach((filter, filterIndex) => {
          if (availableFloors.includes(filterIndex)) {
            filter.classList.remove("hidden");
          } else {
            filter.classList.add("hidden");
          }
        });

        if (availableFloors.length > 1) {
          const pointsFilteredByCategoryAndFloor = filteredBySubcategory.filter(
            (point) => point.floor === availableFloors[0]
          );
          this.setFloorFilters(availableFloors[0]);
          filteredBySubcategory = pointsFilteredByCategoryAndFloor;
          this.resultsFloorFilters[0]?.parentElement?.classList.remove(
            "hidden"
          );
        } else {
          this.resultsFloorFilters[0]?.parentElement?.classList.add("hidden");
        }

        this.drawResults(filteredBySubcategory);
      }
    });

    this.rootElement.addEventListener("click", (event) => {
      const target = event.target as HTMLElement;
      if (
        target.matches(".map__selector-results-card") ||
        target.closest(".map__selector-results-card")
      ) {
        event.preventDefault();
        const card = target.matches(".map__selector-results-card")
          ? target
          : target.closest(".map__selector-results-card");
        const title = card?.getAttribute("data-name");
        if (!title) return;
        this.rootElement.classList.remove("categories-shown");
        this.openPopoverByName(title);
      }
    });

    this.catalogSearchInput?.addEventListener(
      "input",
      this.handleCatalogSearch
    );

    this.catalogCategories.forEach((category) => {
      category.addEventListener("click", (event) => {
        event.preventDefault();
        this.closePopover();

        if (!category.classList.contains("active")) {
          this.catalogCategories.forEach((category) =>
            category.classList.remove("active")
          );
          category.classList.add("active");
          const title = category.querySelector(
            ".catalog__categories-accordion-link-text-inner"
          );
          const titleText = title?.textContent?.trim();
          console.log("Title text", titleText);
          if (!titleText) return;
          this.filterCatalog(titleText);
        } else {
          this.resetFilterCatalog();
        }
      });
    });
    this.catalogMobileCategories.forEach((category) => {
      category.addEventListener("click", (event) => {
        event.preventDefault();
        this.closePopover();

        if (!category.classList.contains("active")) {
          this.catalogMobileCategories.forEach((category) =>
            category.classList.remove("active")
          );
          category.classList.add("active");
          const title = category.querySelector(
            ".catalog__block-subcategories-link-text"
          );
          const titleText = title?.textContent?.trim();
          console.log("Title text", titleText);
          if (!titleText) return;
          this.filterCatalog(titleText);
        } else {
          this.resetFilterCatalog();
        }
      });
    });
  };
}
