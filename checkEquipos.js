import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Leer el archivo .env
const envPath = path.join(__dirname, ".env");
const envContent = fs.readFileSync(envPath, "utf-8");
const envVars = {};

envContent.split("\n").forEach(line => {
  const [key, value] = line.split("=");
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const SUPABASE_URL = envVars.VITE_SUPABASE_URL;
const SUPABASE_KEY = envVars.VITE_SUPABASE_PUBLISHABLE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkEquipos() {
  console.log("🔍 Verificando equipos en Supabase...");
  
  try {
    const { data, error } = await supabase.from("equipos").select("*");

    if (error) {
      console.error("❌ Error al consultar:", error.message);
      return;
    }

    console.log(`✅ Total de equipos: ${data.length}`);
    if (data.length > 0) {
      console.log("📋 Primeros 3 equipos:");
      data.slice(0, 3).forEach(eq => {
        console.log(`   - ${eq.nombre} (${eq.grupo})`);
      });
    } else {
      console.log("⚠️  La tabla está vacía");
    }
  } catch (err) {
    console.error("💥 Error inesperado:", err.message);
  }
}

checkEquipos();
