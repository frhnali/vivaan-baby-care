// Vivaan Baby Care - HomePage Controller

// ==========================



// ==========================
// PAGE LOAD
// ==========================

document.addEventListener(
  "DOMContentLoaded",
  () => {
    fetchHomeProducts();
  }
);


// ==========================
// FETCH PRODUCTS
// ==========================

async function fetchHomeProducts() {

  const featuredContainer =
  document.getElementById(
    "featured-products"
  );

  const trendingContainer =
  document.getElementById(
    "trending-products"
  );

  try {

    const {
      data: products,
      error
    } =
    await supabaseClient
    .from("products")
    .select("*");

    if(error) throw error;

    if(!products || products.length === 0){

      featuredContainer.innerHTML =
      `
      <p class="col-span-2 text-center text-xs text-gray-400 py-6">
        No products found.
      </p>
      `;

      trendingContainer.innerHTML =
      `
      <p class="col-span-2 text-center text-xs text-gray-400 py-6">
        No products found.
      </p>
      `;

      return;
    }

    // FEATURED + TRENDING

    const featuredItems =
    products.slice(0, 4);

    const trendingItems =
    products.slice(4, 8);

    renderProductGrid(
      featuredItems,
      featuredContainer
    );

    renderProductGrid(
      trendingItems,
      trendingContainer
    );

  }

  catch(error){

    console.error(
      "Error loading homepage products:",
      error
    );

    featuredContainer.innerHTML =
    `
    <p class="col-span-2 text-center text-xs text-red-400 py-6">
      Unable to load products.
    </p>
    `;

    trendingContainer.innerHTML =
    `
    <p class="col-span-2 text-center text-xs text-red-400 py-6">
      Unable to load products.
    </p>
    `;

  }

}


// ==========================
// RENDER PRODUCT GRID
// ==========================

function renderProductGrid(
  items,
  container
){

  container.innerHTML = "";

  items.forEach(product => {

    const isFav =
    isInWishlist(product.id);

    const originalPrice =
    product.originalprice ||
    product.price;

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
    bg-white
    rounded-2xl
    p-2.5
    shadow-premium
    border
    border-pink-50
    flex
    flex-col
    justify-between
    relative
    active-scale
    `;

    card.innerHTML = `

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
      bg-white bg-opacity-90
      p-1.5 rounded-full
      shadow-sm z-10
      active-scale
      ">

        <svg
        xmlns="http://www.w3.org/2000/svg"

        class="
        h-4.5 w-4.5
        wishlist-heart
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


      <!-- Product Image -->

      <div

      onclick="
      window.location.href=
      'product-detail.html?id=${product.id}'
      "

      class="
      relative
      rounded-xl
      overflow-hidden
      bg-gray-50
      mb-2
      aspect-[4/5]
      cursor-pointer
      ">

        <img
        src="${product.image}"

        alt="${product.name}"

        class="
        w-full
        h-full
        object-cover
        ">

        <!-- Rating -->

        <div
        class="
        absolute bottom-2 left-2
        bg-white bg-opacity-90
        px-1.5 py-0.5
        rounded-lg
        text-[9px]
        font-bold
        text-vivaanDark
        flex items-center
        space-x-0.5
        shadow-sm
        ">

          <span>
            ${product.rating || 4.5}
          </span>

          <span class="star-rating text-[8px]">
            ★
          </span>

          <span class="text-gray-400 font-medium">
            |
          </span>

          <span class="text-gray-400 font-medium">
            ${product.reviewscount || 120}
          </span>

        </div>

      </div>


      <!-- Product Details -->

      <div

      onclick="
      window.location.href=
      'product-detail.html?id=${product.id}'
      "

      class="
      flex-1
      flex
      flex-col
      justify-between
      cursor-pointer
      ">

        <div>

          <span
          class="
          text-[9px]
          font-extrabold
          uppercase
          tracking-widest
          text-vivaanPink
          leading-none
          ">

          VIVAAN CARE

          </span>

          <h4
          class="
          text-xs
          font-bold
          text-vivaanDark
          truncate
          mt-0.5
          ">

          ${product.name}

          </h4>

        </div>


        <!-- Pricing -->

        <div
        class="
        mt-1.5
        flex
        items-baseline
        space-x-1
        ">

          <span
          class="
          text-xs
          font-extrabold
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

    container.appendChild(card);

  });

}


// ==========================
// WISHLIST TOGGLE
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