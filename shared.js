// Vivaan Baby Care - Shared JS Utility


// ==========================
// SUPABASE CONFIG
// ==========================

const supabaseUrl =
"https://enurllcrzipslevvmitw.supabase.co";

const supabaseKey =
"sb_publishable_mTOKUPDyB8aFCOzsd5zYaA_DmDRUXFi";

const supabaseClient =
supabase.createClient(
  supabaseUrl,
  supabaseKey
);


// ==========================
// LOCAL STORAGE KEYS
// ==========================

const CART_KEY =
"vivaan_cart";

const WISHLIST_KEY =
"vivaan_wishlist";


// ==========================
// CART FUNCTIONS
// ==========================

function getCart(){

  const cartJson =
  localStorage.getItem(
    CART_KEY
  );

  return cartJson
  ?
  JSON.parse(cartJson)
  :
  [];

}


function saveCart(cart){

  localStorage.setItem(
    CART_KEY,
    JSON.stringify(cart)
  );

  updateNavigationBadges();

}


function addToCart(
  productId,
  size,
  quantity = 1
){

  const cart =
  getCart();

  const existingItemIndex =
  cart.findIndex(

    item =>

    item.productId === productId

    &&

    item.size === size

  );

  if(existingItemIndex > -1){

    cart[
      existingItemIndex
    ].quantity += quantity;

  }

  else{

    cart.push({

      productId,
      size,
      quantity

    });

  }

  saveCart(cart);

  showToast(
    "Added to Cart 🛒"
  );

}


function removeFromCart(
  productId,
  size
){

  let cart =
  getCart();

  cart =
  cart.filter(

    item =>

    !(
      item.productId === productId
      &&
      item.size === size
    )

  );

  saveCart(cart);

  showToast(
    "Removed from Cart"
  );

}


function updateCartQuantity(
  productId,
  size,
  quantity
){

  const cart =
  getCart();

  const item =
  cart.find(

    item =>

    item.productId === productId
    &&
    item.size === size

  );

  if(item){

    item.quantity =
    Math.max(1, quantity);

    saveCart(cart);

  }

}


// ==========================
// WISHLIST FUNCTIONS
// ==========================

function getWishlist(){

  const wishlistJson =
  localStorage.getItem(
    WISHLIST_KEY
  );

  return wishlistJson
  ?
  JSON.parse(wishlistJson)
  :
  [];

}


function saveWishlist(
  wishlist
){

  localStorage.setItem(
    WISHLIST_KEY,
    JSON.stringify(wishlist)
  );

  updateNavigationBadges();

}


function toggleWishlist(
  productId
){

  let wishlist =
  getWishlist();

  const index =
  wishlist.indexOf(
    productId
  );

  let added = false;

  if(index > -1){

    wishlist.splice(
      index,
      1
    );

    showToast(
      "Removed from Wishlist 🤍"
    );

  }

  else{

    wishlist.push(
      productId
    );

    added = true;

    showToast(
      "Added to Wishlist ❤️"
    );

  }

  saveWishlist(
    wishlist
  );

  return added;

}


function isInWishlist(
  productId
){

  return getWishlist()
  .includes(productId);

}


// ==========================
// TOAST
// ==========================

function showToast(
  message
){

  let toast =
  document.getElementById(
    "toast"
  );

  if(!toast){

    toast =
    document.createElement(
      "div"
    );

    toast.id = "toast";

    document.body.appendChild(
      toast
    );

  }

  toast.innerHTML =
  message;

  toast.className =
  "show";

  if(window.toastTimeout){

    clearTimeout(
      window.toastTimeout
    );

  }

  window.toastTimeout =
  setTimeout(() => {

    toast.className =
    toast.className.replace(
      "show",
      ""
    );

  }, 2500);

}


// ==========================
// NAVIGATION BADGES
// ==========================

function updateNavigationBadges(){

  // CART BADGE

  const cart =
  getCart();

  const totalCartItems =
  cart.reduce(

    (total, item) =>

    total + item.quantity,

    0

  );

  const cartBadgeEls =
  document.querySelectorAll(
    ".cart-badge"
  );

  cartBadgeEls.forEach(el => {

    if(totalCartItems > 0){

      el.textContent =
      totalCartItems;

      el.classList.remove(
        "hidden"
      );

    }

    else{

      el.classList.add(
        "hidden"
      );

    }

  });


  // WISHLIST BADGE

  const wishlist =
  getWishlist();

  const totalWishlistItems =
  wishlist.length;

  const wishlistBadgeEls =
  document.querySelectorAll(
    ".wishlist-badge"
  );

  wishlistBadgeEls.forEach(el => {

    if(totalWishlistItems > 0){

      el.textContent =
      totalWishlistItems;

      el.classList.remove(
        "hidden"
      );

    }

    else{

      el.classList.add(
        "hidden"
      );

    }

  });

}


// ==========================
// PAGE LOAD
// ==========================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    updateNavigationBadges();

    // SEARCH INPUTS

    const searchInputs =
    document.querySelectorAll(
      ".app-search-input"
    );

    searchInputs.forEach(input => {

      input.addEventListener(
        "keypress",
        (e) => {

          if(e.key === "Enter"){

            const query =
            e.target.value
            .trim();

            if(query){

              window.location.href =
              `
              products.html
              ?search=
              ${encodeURIComponent(query)}
              `;

            }

          }

        }
      );

    });

  }
);