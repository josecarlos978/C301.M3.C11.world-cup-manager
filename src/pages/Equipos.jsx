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
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Apenas se construya mi componente
    getEquipos()
  }, [])

  // Es un estandar que hace referencia OBTENER
  async function getEquipos() {
    try {
      setCargando(true)
      setError(null)
      // SELECT * FROM equipos;
      const { data, error } = await supabase.from('equipos').select('*')

      if (error) {
        console.error('❌ Error al traer equipos:', error)
        setError(error.message)
        return
      }
      console.log('🏆 Todos los equipos:', data)
      console.log('📊 Total de equipos:', data?.length || 0)
      setEquipos(data || []) // Toda la informacion de mi 
      // mi supabase lo estoy introduciendo a equipos
    } catch (err) {
      console.error('💥 Error inesperado:', err)
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  async function deleteEquipo(id){
    // Confirmación antes de eliminar
    if (!confirm('¿Está seguro de que desea eliminar este equipo?')) {
      return
    }

    console.log("🗑️ Eliminando equipo con ID:", id)

    let { error }  = await supabase.from('equipos').delete().eq('id', id)

    if(error){
      console.error('❌ Error al eliminar equipo:', error)
      
      // Mensajes de error más amigables
      let mensajeError = error.message
      if (error.message.includes('foreign key constraint')) {
        mensajeError = '⚠️ No se puede eliminar este equipo porque tiene partidos asociados. Elimina los partidos primero.'
      }
      
      alert(mensajeError)
      return
    }

    console.log('✅ Equipo eliminado exitosamente')
    alert('Equipo eliminado correctamente')
    getEquipos()
  }

  async function postEquipo(e){
    e.preventDefault()

    // Validar que no estén vacíos
    if (!nombre || !grupo || !ranking || !confederacion) {
      alert('⚠️ Por favor completa todos los campos')
      return
    }

    console.log('➕ Agregando nuevo equipo:', {nombre, grupo, ranking_fifa: ranking, confederacion})

    let {data, error} = await supabase.from('equipos').insert({ 
                                    nombre: nombre, 
                                    grupo: grupo, 
                                    ranking_fifa: parseInt(ranking),
                                    confederacion: confederacion})

    if(error){
      console.error('❌ Error al insertar equipo:', error)
      alert('❌ Error al agregar equipo: ' + error.message)
      return
    }

    console.log('✅ Equipo insertado exitosamente')
    alert('✅ Equipo agregado correctamente')
    
    // Limpiar formulario
    setNombre('')
    setGrupo('')
    setRanking('')
    setConfderacion('')
    setEditarEquipo(false)

    // Recargar equipos
    getEquipos()
  }

  function putEquipo(equipo) {
    // Carga los datos del equipo en el formulario para editar
    console.log('📝 Cargando equipo para editar:', equipo)
    setNombre(equipo.nombre)
    setGrupo(equipo.grupo)
    setRanking(equipo.ranking_fifa)
    setConfderacion(equipo.confederacion)
    setEquipoId(equipo.id)
    setEditarEquipo(true)
  }

  async function updateEquipo(e){
    e.preventDefault()

    // Validar que no estén vacíos
    if (!nombre || !grupo || !ranking || !confederacion) {
      alert('⚠️ Por favor completa todos los campos')
      return
    }

    console.log('✏️ Actualizando equipo con ID:', equipoId)

    let {data, error}  = await supabase.from('equipos').update({
                                    nombre: nombre,
                                    grupo: grupo,
                                    ranking_fifa: parseInt(ranking),
                                    confederacion: confederacion
                                    }).eq('id', equipoId)

    if(error){
      console.error('❌ Error al actualizar equipo:', error)
      alert('❌ Error al actualizar equipo: ' + error.message)
      return
    }

    console.log('✅ Equipo actualizado exitosamente')
    alert("✅ Equipo actualizado correctamente")
    
    // Limpiar formulario
    setNombre('')
    setGrupo('')
    setRanking('')
    setConfderacion('')
    setEquipoId('')
    setEditarEquipo(false)
    
    getEquipos()
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🏆 Gestión de Equipos</h1>
          <p className="text-gray-600">Administra los equipos del torneo mundial</p>
        </div>

        {/* Botón Recargar */}
        <div className="mb-6">
          <button 
            onClick={getEquipos}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 flex items-center gap-2"
          >
            🔄 Recargar
          </button>
        </div>

        {/* Mensajes de error y carga */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700">
            <p className="font-semibold">❌ Error: {error}</p>
          </div>
        )}
        {cargando && (
          <div className="mb-6 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded text-yellow-700">
            <p className="font-semibold">⏳ Cargando equipos...</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulario */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editarEquipo ? '✏️ Editar Equipo' : '➕ Nuevo Equipo'}
              </h2>
              
              <form onSubmit={editarEquipo ? updateEquipo : postEquipo} className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="Nombre del equipo"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <input 
                    type="text" 
                    placeholder="Grupo (A, B, C, etc)"
                    value={grupo}
                    onChange={e => setGrupo(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <input 
                    type="text" 
                    placeholder="Ranking FIFA" 
                    value={ranking}  
                    onChange={e => setRanking(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <input 
                    type="text" 
                    placeholder="Confederación" 
                    value={confederacion}
                    onChange={e => setConfderacion(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <button 
                  type="submit"
                  className={`w-full font-semibold py-3 px-4 rounded-lg transition duration-200 text-white ${
                    editarEquipo 
                      ? 'bg-yellow-600 hover:bg-yellow-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {editarEquipo ? '💾 Actualizar Equipo' : '✅ Agregar Equipo'}
                </button>
              </form>
            </div>
          </div>

          {/* Tabla de Equipos */}
          <div className="lg:col-span-2">
            {!cargando && equipos.length === 0 && !error && (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-2xl text-gray-500">📭 No hay equipos registrados aún</p>
              </div>
            )}

            {equipos.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
                  <h2 className="text-white text-xl font-bold">
                    📊 Total: {equipos.length} equipos
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 border-b-2 border-gray-300">
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">Nombre</th>
                        <th className="px-6 py-3 text-center text-gray-700 font-semibold">Grupo</th>
                        <th className="px-6 py-3 text-center text-gray-700 font-semibold">Ranking</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">Confederación</th>
                        <th className="px-6 py-3 text-center text-gray-700 font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        equipos.map((equipo, index) => (
                          <tr 
                            key={equipo.id} 
                            className={`border-b transition hover:bg-green-50 ${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                          >
                            <td className="px-6 py-4 text-gray-800 font-medium">{equipo.nombre}</td>
                            <td className="px-6 py-4 text-center">
                              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full font-bold text-lg">
                                {equipo.grupo}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                                #{equipo.ranking_fifa}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{equipo.confederacion}</td>
                            <td className="px-6 py-4 text-center space-x-2">
                              <button 
                                onClick={()=>putEquipo(equipo)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 inline-block text-sm"
                              >
                                ✏️ Editar
                              </button>
                              <button 
                                onClick={()=>deleteEquipo(equipo.id)}
                                className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 inline-block text-sm"
                              >
                                🗑️ Eliminar
                              </button>
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
