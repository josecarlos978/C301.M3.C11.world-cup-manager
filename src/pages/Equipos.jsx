import { createClient } from "@supabase/supabase-js"
import { useState, useEffect } from "react"

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)

export default function Equipos() {

  const [equipos, setEquipos] = useState([])
  const [nombre, setNombre] = useState("")
  const [grupo, setGrupo] = useState("")
  const [ranking, setRanking] = useState("")
  const [confederacion, setConfderacion] = useState("")
  const [equipoId, setEquipoId] = useState("")
  const [editarEquipo, setEditarEquipo] = useState(false)

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

  async function deleteEquipo(id){
    console.log("Equipo eliminado ", id)

    // DELETE FROM EQUIPOS 
    // WHERE id = '1';
    let { error }  = await supabase.from('equipos').delete().eq('id',id)

    if(error){
      console.log(error)
      return
    }

    getEquipos()

  }

  async function postEquipo(e){
    e.preventDefault()

    // Viene toda la logica para insertar los valores
  /*
    {
      COLUMNA: VARIABLE CON LA INFORMACION
    }
  */

    let {data, error} = await supabase.from('equipos').insert({ 
                                    nombre: nombre, 
                                    grupo: grupo, 
                                    ranking_fifa: ranking,
                                    confederacion: confederacion})

    if(error){
      console.error(error)
      return
    }

    alert('Equipo insertado exitosamente')

    getEquipos()
  }

  function putEquipo(equipo) {
    // Se va a encargar solo de Actualizar el formulario
    console.log(equipo)
    setNombre(equipo.nombre)
    setGrupo(equipo.grupo)
    setRanking(equipo.ranking_fifa)
    setConfderacion(equipo.confederacion)
    setEquipoId(equipo.id)
    setEditarEquipo(true)
  }

  async function updateEquipo(e){
    // Esta funcion si se va a encargar de actualizar el equipo en nuestra
    // Bd
    e.preventDefault()

    let {data, error}  = await supabase.from('equipos').update({
                                    nombre: nombre,
                                    grupo: grupo,
                                    ranking_fifa: ranking,
                                    confederacion: confederacion
                                    }).eq('id', equipoId)

    if(error){
      console.error(error)
      return
    }
    alert("Equipo Actualizado")
    getEquipos()
  }
  
  return (
    <div className="flex items-center justify-center h-[calc(100vh-12rem)]">
      <div className="text-center">
        <h2>Formulario de equipos</h2>
        <form onSubmit={editarEquipo ? updateEquipo : postEquipo}>
          <input 
            type="text" 
            placeholder="Nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Grupo"
            value={grupo}
            onChange={e => setGrupo(e.target.value) }
          />
          <input 
            type="text" 
            placeholder="Ranking" 
            value={ranking}  
            onChange={e => setRanking(e.target.value)}
          />
          <input 
            type="text" 
            placeholder="Conferedacion" 
            value={confederacion}
            onChange={e => setConfderacion(e.target.value)}
          />
          {
            editarEquipo ? 
                         <button>Actualizar Equipo</button> 
                         : 
                         <button>Agregar Equipo</button> 
          }
          
        </form>

        <table>
          <tr>
            <th>Nombre</th>
            <th>Grupo</th>
            <th>Ranking</th>
            <th>Opciones</th>
          </tr>
          {
            equipos.map(equipo => (
              <tr >
                <td>{equipo.nombre}</td>
                <td>{equipo.grupo}</td>
                <td>{equipo.ranking_fifa}</td>
                <td>
                  <button onClick={()=>putEquipo(equipo)}>Editar</button>
                  <button onClick={()=>deleteEquipo(equipo.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          }
        </table>
      </div>
    </div>
  )
}
