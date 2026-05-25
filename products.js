// Vivaan Baby Care - Products Catalog Page Controller

// ==========================



// ==========================
// GLOBALS
// ==========================

let cachedProducts = [];


// ==========================
// PAGE LOAD
// ==========================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    const urlParams =
    new URLSearchParams(
      window.location.search
    );

    const category =
    urlParams.get("category")
    || "all";

    const search =
    urlParams.get("search")
    || "";

    updateTitleUI(
      category,
      search
    );

    fetchProducts(
      category,
      search
    );

    // Search input

    const localSearchInput =
    document.getElementById(
      "catalog-search-input"
    );

    localSearchInput.value =
    search;

    localSearchInput.addEventListener(
      "input",
      (e) => {

        filterAndRender(
          e.target.value
        );

      }
    );

    // Sort

    const sortSelect =
    document.getElementById(
      "sort-selector"
    );

    sortSelect.addEventListener(
      "change",
      () => {

        sortAndRender();

      }
    );

  }
);


// ==========================
// UPDATE TITLE
// ==========================

function updateTitleUI(
  category,
  search
){

  const titleEl =
  document.getElementById(
    "catalog-title"
  );

  if(search){

    titleEl.textContent =
    `Search: "${search}"`;

  }

  else if(
    category &&
    category !== "all"
  ){

    const formatted =
    category
    .split("-")
    .map(
      word =>
      word.charAt(0).toUpperCase()
      +
      word.slice(1)
    )
    .join(" & ");

    titleEl.textContent =
    formatted;

  }

  else{

    titleEl.textContent =
    "All Collections";

  }

}


// ==========================
// FETCH PRODUCTS
// ==========================

async function fetchProducts(
  category,
  search
){

  const gridContainer =
  document.getElementById(
    "catalog-products-grid"
  );

  try {

    let query =
    supabaseClient
    .from("products")
    .select("*");

    // CATEGORY FILTER

    if(
      category &&
      category !== "all"
    ){

      query =
      query.eq(
        "category",
        category
      );

    }

    // SEARCH FILTER

    if(search){

      query =
      query.or(
        `
        name.ilike.%${search}%,
        description.ilike.%${search}%
        `
      );

    }

    const {
      data,
      error
    } =
    await query;

    if(error) throw error;

    cachedProducts =
    data || [];

    document.getElementById(
      "catalog-subtitle"
    ).textContent =
    `
    ${cachedProducts.length}
    ${
      cachedProducts.length === 1
      ?
      'Item'
      :
      'Items'
    }
    found
    `;

    sortAndRender();

  }

  catch(error){

    console.error(error);

    gridContainer.innerHTML =
    `
    <div class="col-span-2 text-center py-12 px-4">

      <span class="text-3xl">
        ⚠️
      </span>

      <h3 class="text-sm font-bold text-vivaanDark mt-2">
        Failed to load products
      </h3>

      <p class="text-xs text-gray-400 mt-1">
        Please refresh.
      </p>

    </div>
    `;

  }

}


// ==========================
// FILTER
// ==========================

function filterAndRender(
  localSearchQuery
){

  const query =
  localSearchQuery
  .toLowerCase()
  .trim();

  let itemsToRender =
  [...cachedProducts];

  if(query){

    itemsToRender =
    itemsToRender.filter(p =>

      p.name
      .toLowerCase()
      .includes(query)

      ||

      p.description
      .toLowerCase()
      .includes(query)

    );

  }

  document.getElementById(
    "catalog-subtitle"
  ).textContent =
  `
  ${itemsToRender.length}
  ${
    itemsToRender.length === 1
    ?
    'Item'
    :
    'Items'
  }
  found
  `;

  renderGrid(
    itemsToRender
  );

}


// ==========================
// SORT
// ==========================

function sortAndRender(){

  const sortVal =
  document.getElementById(
    "sort-selector"
  ).value;

  let items =
  [...cachedProducts];

  if(sortVal === "low-high"){

    items.sort(
      (a,b) =>
      a.price - b.price
    );

  }

  else if(sortVal === "high-low"){

    items.sort(
      (a,b) =>
      b.price - a.price
    );

  }

  else if(sortVal === "rating"){

    items.sort(
      (a,b) =>
      (b.rating || 0)
      -
      (a.rating || 0)
    );

  }

  else if(sortVal === "popularity"){

    items.sort(
      (a,b) =>
      (b.reviewscount || 0)
      -
      (a.reviewscount || 0)
    );

  }

  renderGrid(items);

}


// ==========================
// RENDER GRID
// ==========================

function renderGrid(items){

  const gridContainer =
  document.getElementById(
    "catalog-products-grid"
  );

  gridContainer.innerHTML = "";

  if(items.length === 0){

    gridContainer.innerHTML =
    `
    <div class="col-span-2 text-center py-16 px-4">

      <span class="text-4xl">
        🧸
      </span>

      <h3 class="text-sm font-bold text-vivaanDark mt-3">
        No products found
      </h3>

    </div>
    `;

    return;
  }

  items.forEach(product => {

    const isFav =
    isInWishlist(product.id);

    const originalPrice =
    product.originalprice
    || product.price;

    const discount =
    Math.round(
      (
        (
          originalPrice -
          product.price
        )
        /
        originalPrice
      ) * 100
    );

    const card =
    document.createElement("div");

    card.className =
    `
    bg-white rounded-2xl
    p-2.5 shadow-premium
    border border-pink-50
    flex flex-col
    justify-between
    relative active-scale
    `;

    card.innerHTML =
    `

    <!-- Wishlist -->

    <button

    onclick="
    event.stopPropagation();
    handleWishlistToggle(
    this,
    ${product.id}
    )"

    class="
    absolute top-4 right-4
    bg-white bg-opacity-95
    p-1.5 rounded-full
    shadow-sm z-10 active-scale
    ">

      <svg
      xmlns="http://www.w3.org/2000/svg"

      class="
      h-4.5 w-4.5 wishlist-heart
      ${
        isFav
        ?
        'text-vivaanPink fill-vivaanPink'
        :
        'text-gray-400'
      }
      "

      fill="
      ${
        isFav
        ?
        'currentColor'
        :
        'none'
      }
      "

      viewBox="0 0 24 24"
      stroke="currentColor">

        <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2.5"

        d="
        M4.318 6.318
        a4.5 4.5 0 000 6.364
        L12 20.364
        l7.682-7.682
        a4.5 4.5 0 00-6.364-6.364
        L12 7.636
        l-1.318-1.318
        a4.5 4.5 0 00-6.364 0z
        " />

      </svg>

    </button>


    <!-- Image -->

    <div

    onclick="
    window.location.href=
    'product-detail.html?id=${product.id}'
    "

    class="
    relative rounded-xl
    overflow-hidden bg-gray-50
    mb-2 aspect-[4/5]
    cursor-pointer
    ">

      <img
      src="${product.image}"

      class="
      w-full h-full object-cover
      ">

    </div>


    <!-- Details -->

    <div

    onclick="
    window.location.href=
    'product-detail.html?id=${product.id}'
    "

    class="
    flex-1 flex flex-col
    justify-between cursor-pointer
    ">

      <div>

        <span
        class="
        text-[9px]
        font-extrabold
        uppercase tracking-widest
        text-vivaanPink
        leading-none
        ">

        VIVAAN CARE

        </span>

        <h4
        class="
        text-xs font-bold
        text-vivaanDark
        truncate mt-0.5
        ">

        ${product.name}

        </h4>

      </div>

      <!-- Pricing -->

      <div
      class="
      mt-1.5 flex items-baseline
      space-x-1
      ">

        <span
        class="
        text-xs font-extrabold
        text-vivaanDark
        ">

        ₹${product.price}

        </span>

        <span
        class="
        text-[10px]
        text-gray-400
        line-through
        ">

        ₹${originalPrice}

        </span>

        <span
        class="
        text-[9px]
        font-extrabold
        text-vivaanPink
        font-mono
        ">

        (${discount}% OFF)

        </span>

      </div>

    </div>
    `;

    gridContainer.appendChild(card);

  });

}


// ==========================
// WISHLIST
// ==========================

function handleWishlistToggle(
  button,
  productId
){

  const isAdded =
  toggleWishlist(productId);

  const heartSvg =
  button.querySelector(
    ".wishlist-heart"
  );

  if(isAdded){

    heartSvg.classList.add(
      "text-vivaanPink",
      "fill-vivaanPink"
    );

    heartSvg.setAttribute(
      "fill",
      "currentColor"
    );

  }

  else{

    heartSvg.classList.remove(
      "text-vivaanPink",
      "fill-vivaanPink"
    );

    heartSvg.classList.add(
      "text-gray-400"
    );

    heartSvg.setAttribute(
      "fill",
      "none"
    );

  }

}