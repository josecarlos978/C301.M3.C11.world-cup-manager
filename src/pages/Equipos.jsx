import { createClient } from "@supabase/supabase-js"
import { useState, useEffect } from "react"

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)

export default function Equipos() {

  const [equipos, setEquipos] = useState([])

  useEffect(() => {
    // Apenas se construya mi componente
    getEquipos()
  }, [])

  // Es un estandar que hace referencia OBTENER
  async function getEquipos() {
    // SELECT * FROM equipos;
    const { data, error } = await supabase.from('equipos').select('*')

    if (error) {
      console.error(error)
      return
    }
    console.log(data)
    setEquipos(data) // Toda la informacion de mi 
    // mi supabase lo estoy introduciendo a equipos
  }

  return (
    <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
      <div className="text-center">
        <table>
          <tr>
            <th>Nombre</th>
            <th>Grupo</th>
            <th>Ranking</th>
            <th>Opciones</th>
          </tr>
          {
            equipos.map(equipo => (
              <tr>
                <td>{equipo.nombre}</td>
                <td>{equipo.grupo}</td>
                <td>{equipo.ranking_fifa}</td>
                <td>
                  <buton>Editar</buton>
                  <button>Eliminar</button>
                </td>
              </tr>
            ))
          }
        </table>
      </div>
    </div>
  )
}
