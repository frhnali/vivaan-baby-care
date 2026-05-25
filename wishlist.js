// Vivaan Baby Care - Wishlist Page Controller


// ==========================
// PAGE LOAD
// ==========================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadWishlistGrid();

  }
);


// ==========================
// LOAD WISHLIST
// ==========================

async function loadWishlistGrid(){

  const gridContainer =
  document.getElementById(
    "wishlist-products-grid"
  );

  const favoritedIds =
  getWishlist();

  if(favoritedIds.length === 0){

    renderEmptyWishlist();

    return;

  }

  try {

    // ==========================
    // FETCH FROM SUPABASE
    // ==========================

    const {
      data: allProducts,
      error
    } =
    await supabaseClient
    .from("products")
    .select("*");

    if(error) throw error;

    // FILTER WISHLIST ITEMS

    const wishlistedProducts =
    allProducts.filter(

      p =>
      favoritedIds.includes(p.id)

    );

    if(wishlistedProducts.length === 0){

      renderEmptyWishlist();

      return;

    }

    gridContainer.innerHTML = "";

    // ==========================
    // RENDER PRODUCTS
    // ==========================

    wishlistedProducts.forEach(product => {

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
      document.createElement(
        "div"
      );

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
      <!-- REMOVE BUTTON -->

      <button

      onclick="
      event.stopPropagation();
      removeWishlistItem(
      ${product.id}
      )"

      class="
      absolute top-4 right-4
      bg-white bg-opacity-95
      p-1.5 rounded-full
      shadow-sm z-10
      active-scale
      ">

        <svg
        xmlns="http://www.w3.org/2000/svg"

        class="
        h-4 w-4
        text-gray-400
        hover:text-vivaanPink
        "

        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor">

          <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"

          d="
          M6 18L18 6
          M6 6l12 12
          " />

        </svg>

      </button>


      <!-- IMAGE -->

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

        alt="${product.name}"

        class="
        w-full h-full
        object-cover
        ">

        <!-- RATING -->

        <div
        class="
        absolute bottom-2 left-2
        bg-white bg-opacity-90
        px-1.5 py-0.5
        rounded-lg text-[9px]
        font-bold text-vivaanDark
        flex items-center
        space-x-0.5 shadow-sm
        ">

          <span>
            ${product.rating || 4.5}
          </span>

          <span class="star-rating text-[8px]">
            ★
          </span>

        </div>

      </div>


      <!-- DETAILS -->

      <div

      onclick="
      window.location.href=
      'product-detail.html?id=${product.id}'
      "

      class="
      flex-1 flex flex-col
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
          text-xs font-bold
          text-vivaanDark
          truncate mt-0.5
          ">

          ${product.name}

          </h4>

          <!-- PRICE -->

          <div
          class="
          mt-1 flex
          items-baseline
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
            text-[9px]
            text-gray-400
            line-through
            ">

            ₹${originalPrice}

            </span>

            <span
            class="
            text-[8px]
            font-black
            text-vivaanPink
            ">

            (${discount}% OFF)

            </span>

          </div>

        </div>


        <!-- MOVE TO CART -->

        <button

        onclick="
        event.stopPropagation();
        moveToCart(
        ${product.id}
        )"

        class="
        w-full mt-3 py-2
        bg-vivaanPink
        text-white text-[10px]
        font-bold rounded-xl
        active-scale uppercase
        tracking-wider shadow-sm
        ">

        Move to Cart

        </button>

      </div>
      `;

      gridContainer.appendChild(
        card
      );

    });

  }

  catch(error){

    console.error(
      "Error loading wishlist:",
      error
    );

    gridContainer.innerHTML =

    `
    <p class="
    col-span-2
    text-center
    text-xs
    text-red-400
    py-12
    ">

    Unable to load wishlist.

    </p>
    `;

  }

}


// ==========================
// REMOVE WISHLIST ITEM
// ==========================

function removeWishlistItem(
  productId
){

  toggleWishlist(
    productId
  );

  loadWishlistGrid();

}


// ==========================
// MOVE TO CART
// ==========================

function moveToCart(
  productId
){

  addToCart(
    productId,
    "Free Size",
    1
  );

  toggleWishlist(
    productId
  );

  showToast(
    "Moved to Cart 🛒"
  );

  loadWishlistGrid();

}


// ==========================
// EMPTY WISHLIST
// ==========================

function renderEmptyWishlist(){

  const container =
  document.getElementById(
    "wishlist-products-grid"
  );

  container.className =
  `
  flex flex-col
  items-center
  justify-center
  py-20 px-4
  text-center
  `;

  container.innerHTML =

  `
  <span class="text-5xl">
    🤍
  </span>

  <h3
  class="
  text-sm font-extrabold
  text-vivaanDark
  mt-4 uppercase
  tracking-wider
  ">

  Your Wishlist is Empty

  </h3>

  <p
  class="
  text-xs text-gray-400
  mt-1 max-w-[240px]
  ">

  Save your favorite products here.

  </p>

  <button

  onclick="
  window.location.href=
  'products.html?category=all'
  "

  class="
  mt-6 px-6 py-3
  bg-vivaanPink
  text-white text-xs
  font-bold rounded-2xl
  active-scale uppercase
  tracking-wider
  shadow-lg shadow-pink-100
  ">

  Start Shopping

  </button>
  `;

}