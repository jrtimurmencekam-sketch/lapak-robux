const { createClient } = require("@supabase/supabase-js");
const fs = require("fs");

// Read env variables
const envFile = fs.readFileSync(".env.local", "utf8");
let supabaseUrl = "";
let supabaseKey = "";
envFile.split("\n").forEach((line) => {
  if (line.startsWith("NEXT_PUBLIC_SUPABASE_URL="))
    supabaseUrl = line.split("=")[1].trim();
  if (line.startsWith("NEXT_PUBLIC_SUPABASE_ANON_KEY="))
    supabaseKey = line.split("=")[1].trim();
});

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .ilike("title", "%royal dreams%")
    .limit(5);

  if (error) {
    console.error("Error fetching:", error);
    return;
  }

  if (data && data.length > 0) {
    console.log(JSON.stringify(data, null, 2));
  } else {
    console.log('Tidak ada produk dengan judul "Royal Dreams" yang ditemukan.');
  }
}

check();
