// Vivaan Baby Care - Cart Page Controller

let cartProductsCached = [];
let appliedCoupon = null;


// ==========================
// PAGE LOAD
// ==========================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadCartPage();

  }
);


// ==========================
// LOAD CART PAGE
// ==========================

async function loadCartPage(){

  const cartItems =
  getCart();

  const headerCountEl =
  document.getElementById(
    "cart-header-count"
  );

  const totalQuantity =
  cartItems.reduce(

    (total, item) =>

    total + item.quantity,

    0

  );

  headerCountEl.textContent =
  `
  ${totalQuantity}
  ${
    totalQuantity === 1
    ?
    'Item'
    :
    'Items'
  }
  `;

  if(cartItems.length === 0){

    renderEmptyCart();

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

    // ==========================
    // MAP CART PRODUCTS
    // ==========================

    cartProductsCached =
    cartItems.map(item => {

      const prodData =
      allProducts.find(

        p =>
        p.id === item.productId

      );

      return {

        ...item,
        data: prodData

      };

    })
    .filter(
      item =>
      item.data !== undefined
    );

    if(cartProductsCached.length === 0){

      renderEmptyCart();

      return;

    }

    // SHOW CONTAINERS

    document
    .getElementById(
      "coupon-container"
    )
    .classList.remove(
      "hidden"
    );

    document
    .getElementById(
      "price-summary-container"
    )
    .classList.remove(
      "hidden"
    );

    renderCartItems();

    calculatePriceDetails();

    setupCouponSystem();

    setupOrderPlacement();

  }

  catch(error){

    console.error(
      "Error loading cart:",
      error
    );

    document
    .getElementById(
      "cart-items-list"
    )
    .innerHTML =

    `
    <p class="
    text-center
    text-xs
    text-red-400
    py-12
    ">

    Unable to load cart.

    </p>
    `;

  }

}


// ==========================
// RENDER CART ITEMS
// ==========================

function renderCartItems(){

  const container =
  document.getElementById(
    "cart-items-list"
  );

  container.innerHTML = "";

  cartProductsCached.forEach(item => {

    const p =
    item.data;

    const originalPrice =
    p.originalprice ||
    p.price;

    const card =
    document.createElement(
      "div"
    );

    card.className =
    `
    bg-white
    rounded-2xl
    p-3
    shadow-premium
    border border-pink-50
    flex space-x-3
    relative active-scale
    `;

    card.innerHTML =

    `
    <!-- REMOVE BUTTON -->

    <button

    onclick="
    handleRemoveItem(
    ${p.id},
    '${item.size}'
    )"

    class="
    absolute top-3 right-3
    text-gray-400
    active-scale
    ">

      <svg
      xmlns="http://www.w3.org/2000/svg"

      class="h-4.5 w-4.5"

      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor">

        <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"

        d="
        M19 7l-.867 12.142
        A2 2 0 0116.138 21
        H7.862a2 2 0 01-1.995-1.858
        L5 7m5 4v6m4-6v6m1-10V4
        a1 1 0 00-1-1h-4
        a1 1 0 00-1 1v3M4 7h16
        " />

      </svg>

    </button>


    <!-- IMAGE -->

    <div

    onclick="
    window.location.href=
    'product-detail.html?id=${p.id}'
    "

    class="
    w-20 h-24
    bg-gray-50
    rounded-xl
    overflow-hidden
    flex-shrink-0
    shadow-sm
    cursor-pointer
    ">

      <img
      src="${p.image}"

      alt="${p.name}"

      class="
      w-full h-full
      object-cover
      ">

    </div>


    <!-- DETAILS -->

    <div
    class="
    flex-1 flex
    flex-col justify-between
    py-0.5 pr-4
    ">

      <div

      onclick="
      window.location.href=
      'product-detail.html?id=${p.id}'
      "

      class="cursor-pointer">

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

        ${p.name}

        </h4>

        <span
        class="
        inline-block bg-gray-100
        text-gray-500 font-bold
        px-2 py-0.5
        rounded-md text-[9px]
        mt-1
        ">

        Size: ${item.size}

        </span>

      </div>


      <!-- PRICE + QTY -->

      <div
      class="
      flex items-center
      justify-between mt-2
      ">

        <!-- Pricing -->

        <div
        class="
        flex items-baseline
        space-x-1
        ">

          <span
          class="
          text-sm font-extrabold
          text-vivaanDark
          ">

          ₹${p.price}

          </span>

          <span
          class="
          text-[10px]
          text-gray-400
          line-through
          ">

          ₹${originalPrice}

          </span>

        </div>


        <!-- Quantity -->

        <div
        class="
        flex items-center
        border border-gray-200
        rounded-xl px-1 py-0.5
        bg-gray-50
        ">

          <button

          onclick="
          adjustQuantity(
          ${p.id},
          '${item.size}',
          -1
          )"

          class="
          w-6 h-6
          flex items-center
          justify-center
          font-bold text-xs
          text-vivaanDark
          active-scale
          ">

          -

          </button>

          <span
          class="
          w-5 text-center
          text-xs font-bold
          text-vivaanDark
          ">

          ${item.quantity}

          </span>

          <button

          onclick="
          adjustQuantity(
          ${p.id},
          '${item.size}',
          1
          )"

          class="
          w-6 h-6
          flex items-center
          justify-center
          font-bold text-xs
          text-vivaanDark
          active-scale
          ">

          +

          </button>

        </div>

      </div>

    </div>
    `;

    container.appendChild(card);

  });

}


// ==========================
// QUANTITY
// ==========================

function adjustQuantity(
  productId,
  size,
  direction
){

  const item =
  cartProductsCached.find(

    i =>

    i.productId === productId
    &&
    i.size === size

  );

  if(item){

    const newQty =
    item.quantity + direction;

    if(newQty < 1){

      handleRemoveItem(
        productId,
        size
      );

    }

    else{

      item.quantity =
      newQty;

      updateCartQuantity(
        productId,
        size,
        newQty
      );

      renderCartItems();

      calculatePriceDetails();

    }

  }

}


// ==========================
// REMOVE ITEM
// ==========================

function handleRemoveItem(
  productId,
  size
){

  removeFromCart(
    productId,
    size
  );

  loadCartPage();

}


// ==========================
// PRICE CALCULATIONS
// ==========================

function calculatePriceDetails(){

  let totalMrp = 0;

  let totalSellingPrice = 0;

  cartProductsCached.forEach(item => {

    const originalPrice =
    item.data.originalprice
    || item.data.price;

    totalMrp +=
    originalPrice
    *
    item.quantity;

    totalSellingPrice +=
    item.data.price
    *
    item.quantity;

  });

  const productDiscount =
  totalMrp - totalSellingPrice;

  let couponDiscount = 0;

  if(appliedCoupon){

    couponDiscount =
    Math.round(

      totalSellingPrice *

      (
        appliedCoupon.discountPercent
        / 100
      )

    );

  }

  const finalTotal =
  totalSellingPrice
  -
  couponDiscount;

  document.getElementById(
    "summary-mrp"
  ).textContent =
  `₹${totalMrp}`;

  document.getElementById(
    "summary-discount"
  ).textContent =
  `-₹${productDiscount}`;

  document.getElementById(
    "summary-coupon"
  ).textContent =

  couponDiscount > 0
  ?
  `-₹${couponDiscount}`
  :
  `₹0`;

  document.getElementById(
    "summary-total"
  ).textContent =
  `₹${finalTotal}`;

}


// ==========================
// COUPONS
// ==========================

function setupCouponSystem(){

  const applyBtn =
  document.getElementById(
    "coupon-apply-btn"
  );

  const input =
  document.getElementById(
    "coupon-code-input"
  );

  const feedback =
  document.getElementById(
    "coupon-feedback"
  );

  applyBtn.onclick = () => {

    const code =
    input.value
    .trim()
    .toUpperCase();

    if(code === "BABY30"){

      appliedCoupon = {

        code: "BABY30",

        discountPercent: 30

      };

      feedback.textContent =
      `
      ✔ Coupon Applied!
      30% OFF
      `;

      feedback.className =
      `
      text-[10px]
      font-bold
      text-vivaanMint
      mt-1 block
      `;

      calculatePriceDetails();

      showToast(
        "Coupon Applied 🏷️"
      );

    }

    else{

      feedback.textContent =
      `
      ❌ Invalid Coupon
      `;

      feedback.className =
      `
      text-[10px]
      font-bold
      text-red-500
      mt-1 block
      `;

    }

  };

}


// ==========================
// ORDER PLACEMENT
// ==========================

function setupOrderPlacement(){

  const placeOrderBtn =
  document.getElementById(
    "place-order-btn"
  );

  const modal =
  document.getElementById(
    "checkout-success-modal"
  );

  const continueBtn =
  document.getElementById(
    "success-continue-btn"
  );

  placeOrderBtn.onclick = () => {

    const receiptContainer =
    document.getElementById(
      "success-items-receipt"
    );

    receiptContainer.innerHTML =
    "";

    cartProductsCached.forEach(item => {

      const row =
      document.createElement(
        "div"
      );

      row.className =
      `
      flex justify-between
      items-center text-xs
      py-1 border-b
      border-gray-50
      border-dashed
      text-gray-600
      font-medium
      `;

      row.innerHTML =
      `
      <div
      class="
      flex flex-col
      text-left truncate mr-3
      ">

        <span
        class="
        font-bold text-vivaanDark
        truncate
        ">

        ${item.data.name}

        </span>

        <span
        class="
        text-[9px]
        text-gray-400
        ">

        Size:
        ${item.size}
        |
        Qty:
        ${item.quantity}

        </span>

      </div>

      <span
      class="
      font-extrabold
      text-vivaanDark
      flex-shrink-0
      ">

      ₹${item.data.price * item.quantity}

      </span>
      `;

      receiptContainer.appendChild(
        row
      );

    });

    document.getElementById(
      "success-total-paid"
    ).textContent =

    document.getElementById(
      "summary-total"
    ).textContent;

    modal.classList.remove(
      "hidden"
    );

    setTimeout(() => {

      modal.classList.remove(
        "opacity-0"
      );

    }, 10);

  };

  continueBtn.onclick = () => {

    localStorage.removeItem(
      "vivaan_cart"
    );

    updateNavigationBadges();

    modal.classList.add(
      "opacity-0"
    );

    setTimeout(() => {

      modal.classList.add(
        "hidden"
      );

      window.location.href =
      "index.html";

    }, 300);

  };

}


// ==========================
// EMPTY CART
// ==========================

function renderEmptyCart(){

  document
  .getElementById(
    "coupon-container"
  )
  .classList.add(
    "hidden"
  );

  document
  .getElementById(
    "price-summary-container"
  )
  .classList.add(
    "hidden"
  );

  const container =
  document.getElementById(
    "cart-items-list"
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
    🛍️
  </span>

  <h3
  class="
  text-sm font-extrabold
  text-vivaanDark
  mt-4 uppercase
  tracking-wider
  ">

  Your Cart is Empty

  </h3>

  <p
  class="
  text-xs text-gray-400
  mt-1 max-w-[240px]
  ">

  Explore premium collections.

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