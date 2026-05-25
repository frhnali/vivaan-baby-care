// Vivaan Baby Care - Categories Page Controller


// ==========================
// PAGE LOAD
// ==========================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    fetchCategoryCounts();

  }
);


// ==========================
// FETCH CATEGORY COUNTS
// ==========================

async function fetchCategoryCounts(){

  try {

    // ==========================
    // FETCH FROM SUPABASE
    // ==========================

    const {
      data: products,
      error
    } =
    await supabaseClient
    .from("products")
    .select("*");

    if(error) throw error;

    // ==========================
    // CATEGORY COUNTS
    // ==========================

    const counts = {

      "rompers-onesies": 0,

      "frocks-dresses": 0,

      "sets-suits": 0,

      "innerwear-sleepwear": 0,

      "accessories": 0,

      "toys": 0

    };

    // COUNT PRODUCTS

    products.forEach(p => {

      if(
        counts[p.category]
        !== undefined
      ){

        counts[p.category]++;

      }

    });

    // ==========================
    // UPDATE UI
    // ==========================

    Object.keys(counts)
    .forEach(cat => {

      const el =
      document.querySelector(
        `.count-${cat}`
      );

      if(el){

        const count =
        counts[cat];

        el.textContent =

        `
        ${count}
        ${
          count === 1
          ?
          'Product'
          :
          'Products'
        }
        `;

      }

    });

  }

  catch(error){

    console.error(
      "Error fetching categories:",
      error
    );

    // ==========================
    // FALLBACK VALUES
    // ==========================

    const fallbacks = {

      "rompers-onesies":
      "Premium Onesies",

      "frocks-dresses":
      "Party Dresses",

      "sets-suits":
      "Matching Sets",

      "innerwear-sleepwear":
      "Comfy Pajamas",

      "accessories":
      "Bonnets & Bibs",

      "toys":
      "Sensory Play"

    };

    Object.keys(fallbacks)
    .forEach(cat => {

      const el =
      document.querySelector(
        `.count-${cat}`
      );

      if(el){

        el.textContent =
        fallbacks[cat];

      }

    });

  }

}