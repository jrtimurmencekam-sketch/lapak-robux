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
  const { data, error } = await supabase.from("products").select("*").limit(3);
  console.log(JSON.stringify(data, null, 2));
}

check();
