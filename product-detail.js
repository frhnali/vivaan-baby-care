// Vivaan Baby Care - Product Detail Page Controller

// ==========================



// ==========================
// GLOBALS
// ==========================

let currentProduct = null;
let selectedSize = null;


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

    const id =
    urlParams.get("id");

    if(!id){

      showToast(
        "No product selected."
      );

      setTimeout(() => {

        window.location.href =
        "products.html";

      }, 1500);

      return;
    }

    fetchProductDetails(id);

    setupPincodeChecker();

    setupShareButton();

    setupWishlistButton(
      parseInt(id)
    );

    setupActionButtons(
      parseInt(id)
    );

  }
);


// ==========================
// FETCH PRODUCT
// ==========================

async function fetchProductDetails(
  productId
){

  try {

    const {
      data,
      error
    } =
    await supabaseClient
    .from("products")
    .select("*")
    .eq("id", productId)
    .single();

    if(error) throw error;

    currentProduct = data;

    renderProductDetails(
      currentProduct
    );

    fetchSimilarProducts(
      currentProduct.category,
      currentProduct.id
    );

  }

  catch(error){

    console.error(error);

    showToast(
      "Error loading product."
    );

  }

}


// ==========================
// RENDER PRODUCT
// ==========================

function renderProductDetails(
  product
){

  document.getElementById(
    "detail-product-name"
  ).textContent =
  product.name;

  // Rating

  const ratingBubble =
  document.getElementById(
    "detail-rating-bubble"
  );

  ratingBubble.innerHTML =
  `
  <span>
    ${product.rating || 4.5}
  </span>

  <span class="star-rating">
    ★
  </span>

  <span class="text-gray-300">
    |
  </span>

  <span class="text-gray-400 font-medium">
    ${product.reviewscount || 120} Ratings
  </span>
  `;

  // Pricing

  const originalPrice =
  product.originalprice ||
  product.price;

  document.getElementById(
    "detail-price"
  ).textContent =
  `₹${product.price}`;

  document.getElementById(
    "detail-original-price"
  ).textContent =
  `₹${originalPrice}`;

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

  document.getElementById(
    "detail-discount-tag"
  ).textContent =
  `${discount}% OFF`;

  // Description

  document.getElementById(
    "detail-description"
  ).textContent =
  product.description;

  // Specs

  const details =
  product.details || {};

  document.getElementById(
    "spec-fabric"
  ).textContent =
  details.fabric ||
  "100% Organic Cotton";

  document.getElementById(
    "spec-care"
  ).textContent =
  details.care ||
  "Machine Wash";

  document.getElementById(
    "spec-origin"
  ).textContent =
  details.origin ||
  "Made in India";

  // Images

  renderImageSlider(
    product.images ||
    [product.image]
  );

  // Sizes

  renderSizes(
    product.sizes ||
    "0-3M,3-6M,6-9M"
  );

  // Wishlist UI

  updateWishlistButtonUI(
    product.id
  );

}


// ==========================
// IMAGE SLIDER
// ==========================

function renderImageSlider(
  imageUrls
){

  const slider =
  document.getElementById(
    "detail-image-slider"
  );

  const dotsContainer =
  document.getElementById(
    "slider-dots"
  );

  slider.innerHTML = "";
  dotsContainer.innerHTML = "";

  imageUrls.forEach(
    (url, index) => {

      const slide =
      document.createElement("div");

      slide.className =
      `
      w-full h-full
      flex-shrink-0
      snap-start relative
      `;

      slide.innerHTML =
      `
      <img
      src="${url}"
      class="w-full h-full object-cover">
      `;

      slider.appendChild(slide);

      const dot =
      document.createElement("span");

      dot.className =
      `
      w-1.5 h-1.5
      rounded-full
      ${
        index === 0
        ?
        'bg-vivaanPink w-3'
        :
        'bg-gray-300'
      }
      `;

      dotsContainer.appendChild(dot);

    }
  );

}


// ==========================
// SIZES
// ==========================

function renderSizes(
  sizesString
){

  const container =
  document.getElementById(
    "detail-sizes-list"
  );

  container.innerHTML = "";

  const sizes =
  sizesString.split(",");

  sizes.forEach(size => {

    const btn =
    document.createElement("button");

    btn.className =
    `
    px-4 py-2
    border border-gray-200
    rounded-xl text-xs
    font-bold
    text-vivaanDark
    active-scale bg-white
    `;

    btn.textContent = size;

    btn.onclick = () => {

      container
      .querySelectorAll("button")
      .forEach(b => {

        b.classList.remove(
          "size-chip-active"
        );

      });

      btn.classList.add(
        "size-chip-active"
      );

      selectedSize = size;

    };

    container.appendChild(btn);

  });

}


// ==========================
// SIMILAR PRODUCTS
// ==========================

async function fetchSimilarProducts(
  category,
  excludeId
){

  const container =
  document.getElementById(
    "similar-products-scroll"
  );

  try {

    const {
      data: products,
      error
    } =
    await supabaseClient
    .from("products")
    .select("*")
    .eq("category", category);

    if(error) throw error;

    const filtered =
    products.filter(
      p => p.id !== excludeId
    );

    container.innerHTML = "";

    filtered.forEach(p => {

      const card =
      document.createElement("div");

      card.className =
      `
      w-32 flex-shrink-0
      bg-white rounded-2xl
      p-2 shadow-premium
      border border-pink-50
      active-scale cursor-pointer
      flex flex-col
      justify-between
      `;

      card.onclick = () => {

        window.location.href =
        `product-detail.html?id=${p.id}`;

      };

      card.innerHTML =
      `
      <div class="rounded-xl overflow-hidden bg-gray-50 aspect-square mb-1">

        <img
        src="${p.image}"
        class="w-full h-full object-cover">

      </div>

      <div class="flex-1 flex flex-col justify-between">

        <h4 class="text-[10px] font-bold text-vivaanDark truncate">
          ${p.name}
        </h4>

        <div class="flex items-center space-x-1 mt-0.5">

          <span class="text-[10px] font-extrabold text-vivaanDark">
            ₹${p.price}
          </span>

        </div>

      </div>
      `;

      container.appendChild(card);

    });

  }

  catch(error){

    console.error(error);

  }

}
