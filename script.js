const supabaseUrl =
"https://enurllcrzipslevvmitw.supabase.co";

const supabaseKey =
"sb_publishable_mTOKUPDyB8aFCOzsd5zYaA_DmDRUXFi";

const supabaseClient =
supabase.createClient(
  supabaseUrl,
  supabaseKey
);

async function loadProducts() {

  const { data, error } =
  await supabaseClient
  .from("products")
  .select("*");

  console.log(data);

}

loadProducts();