import { createClient } from "@supabase/supabase-js";
import { useEffect } from "react";
import { useState } from "react";
const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

export default function Equipos() {

  const [instruments, setInstruments] = useState([]);

  useEffect(() => {
    getInstruments();
  }, []);

  async function getInstruments() {
    const { data, error } = await supabase.from("equipos").select('*');
    if (error) {
      console.error(error);
      return;
    }
    setInstruments(data);
    console.log(data)
  }


  return (
    <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
      <div className="text-center">
        <span className="material-symbols-outlined text-6xl text-outline mb-4">groups</span>
        <h2 className="text-headline-md text-primary mb-2">Equipos</h2>
        <p className="text-body-md text-on-surface-variant">Gestión de selecciones participantes</p>
      </div>
    </div>
  )
}
