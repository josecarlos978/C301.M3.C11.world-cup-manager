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
// Usa la service_role key si está disponible, sino usa la publishable key
const SUPABASE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Error: Las variables VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY no están configuradas");
  console.error("💡 Configúralas en tu archivo .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const equipos = [
  { nombre: "Argentina", grupo: "A", ranking_fifa: 1, confederacion: "CONMEBOL" },
  { nombre: "Francia", grupo: "A", ranking_fifa: 4, confederacion: "UEFA" },
  { nombre: "Brasil", grupo: "G", ranking_fifa: 5, confederacion: "CONMEBOL" },
  { nombre: "España", grupo: "E", ranking_fifa: 8, confederacion: "UEFA" },
  { nombre: "Alemania", grupo: "E", ranking_fifa: 16, confederacion: "UEFA" },
  { nombre: "Italia", grupo: "F", ranking_fifa: 10, confederacion: "UEFA" },
  { nombre: "Portugal", grupo: "H", ranking_fifa: 9, confederacion: "UEFA" },
  { nombre: "Holanda", grupo: "A", ranking_fifa: 8, confederacion: "UEFA" },
  { nombre: "Bélgica", grupo: "F", ranking_fifa: 2, confederacion: "UEFA" },
  { nombre: "Uruguay", grupo: "H", ranking_fifa: 13, confederacion: "CONMEBOL" },
  { nombre: "México", grupo: "C", ranking_fifa: 13, confederacion: "CONCACAF" },
  { nombre: "Japón", grupo: "E", ranking_fifa: 24, confederacion: "AFC" },
  { nombre: "Corea del Sur", grupo: "H", ranking_fifa: 28, confederacion: "AFC" },
  { nombre: "Estados Unidos", grupo: "B", ranking_fifa: 16, confederacion: "CONCACAF" },
  { nombre: "Inglaterra", grupo: "B", ranking_fifa: 5, confederacion: "UEFA" },
  { nombre: "Senegal", grupo: "A", ranking_fifa: 18, confederacion: "CAF" },
];

async function seedEquipos() {
  console.log("🌱 Iniciando inserción de equipos...");
  
  try {
    // Primero, limpiar los equipos existentes (opcional)
    const { error: deleteError } = await supabase.from("equipos").delete().neq("id", 0);
    
    if (deleteError) {
      console.warn("⚠️ Advertencia al limpiar datos:", deleteError.message);
    } else {
      console.log("🗑️ Datos anteriores eliminados");
    }

    // Insertar los nuevos equipos
    const { data, error } = await supabase.from("equipos").insert(equipos);

    if (error) {
      console.error("❌ Error al insertar equipos:", error.message);
      return;
    }

    console.log("✅ ¡Equipos insertados exitosamente!");
    console.log(`📊 Se insertaron ${equipos.length} equipos`);
    console.log("🏆 Equipos:", equipos.map(e => e.nombre).join(", "));
  } catch (err) {
    console.error("💥 Error inesperado:", err.message);
  }
}

seedEquipos();
