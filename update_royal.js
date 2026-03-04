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

const nominals = [
  { id: "rd-3b", name: "3B", price: 100000 },
  { id: "rd-7b", name: "7B", price: 200000 },
  { id: "rd-11b", name: "11B", price: 300000 },
  { id: "rd-16b", name: "16B", price: 400000 },
  { id: "rd-20b", name: "20B", price: 500000 },
  { id: "rd-25b", name: "25B", price: 600000 },
  { id: "rd-30b", name: "30B", price: 700000 },
  { id: "rd-35b", name: "35B", price: 800000 },
  { id: "rd-40b", name: "40B", price: 900000 },
  { id: "rd-50b", name: "50B", price: 1000000 },
];

async function updateProduct() {
  const { data, error } = await supabase
    .from("products")
    .update({
      nominals: JSON.stringify(nominals),
      slug: "royal-dreams",
    })
    .eq("id", "fa216a65-d258-417b-9663-f097b8c92127") // ID from previous query
    .select();

  if (error) {
    console.error("Error updating:", error);
    return;
  }

  console.log("Update successful:", JSON.stringify(data, null, 2));
}

updateProduct();
