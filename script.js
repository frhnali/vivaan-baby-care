const supabaseUrl =
"https://enurllcrzipslevvmitw.supabase.co";

const supabaseKey =
"sb_publishable_mTOKUPDyB8aFCOzsd5zYaA_DmDRUXFi";

const supabaseClient =
supabase.createClient(
  supabaseUrl,
  supabaseKey
);

// LOAD PRODUCTS

async function loadProducts() {

  const { data, error } =
  await supabaseClient
  .from("products")
  .select("*");

  console.log(data);

  const productContainer =
  document.querySelector(".product-container");

  productContainer.innerHTML = "";

  data.forEach(product => {

    productContainer.innerHTML += `

      <div class="product-card">

        <img src="${product.image}">

        <h3>${product.name}</h3>

        <p class="price">₹${product.price}</p>

        <p>${product.description}</p>

        <button onclick="addToCart('${product.name}', '${product.price}')">
          Add To Cart
        </button>

      </div>

    `;

  });

}

loadProducts();


// ADD TO CART FUNCTION

function addToCart(name, price){

  let cart =
  JSON.parse(
    localStorage.getItem("cart")
  ) || [];

  cart.push({
    name:name,
    price:price
  });

  localStorage.setItem(
    "cart",
    JSON.stringify(cart)
  );

  alert(name + " added to cart 😄");

  console.log(cart);

}
