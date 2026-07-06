import { createClient } from "@supabase/supabase-js"
import { useState, useEffect } from "react"

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)

export default function Jugadores() {

  const [jugadores, setJugadores] = useState([])
  const [nombre, setNombre] = useState("")
  const [posicion, setPosicion] = useState("")
  const [dorsal, setDorsal] = useState("")
  const [equipo, setEquipo] = useState("")
  const [activo, setActivo] = useState(true)
  const [jugadorId, setJugadorId] = useState("")
  const [editarJugador, setEditarJugador] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Apenas se construya mi componente
    getJugadores()
  }, [])

  // Obtener jugadores
  async function getJugadores() {
    try {
      setCargando(true)
      setError(null)
      const { data, error } = await supabase.from('jugadores').select('*')

      if (error) {
        console.error('❌ Error al traer jugadores:', error)
        setError(error.message)
        return
      }
      console.log('⚽ Todos los jugadores:', data)
      console.log('📊 Total de jugadores:', data?.length || 0)
      setJugadores(data || [])
    } catch (err) {
      console.error('💥 Error inesperado:', err)
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  async function deleteJugador(id){
    // Confirmación antes de eliminar
    if (!confirm('¿Está seguro de que desea eliminar este jugador?')) {
      return
    }

    console.log("🗑️ Eliminando jugador con ID:", id)

    let { error } = await supabase.from('jugadores').delete().eq('id', id)

    if(error){
      console.error('❌ Error al eliminar jugador:', error)
      
      // Mensajes de error más amigables
      let mensajeError = error.message
      if (error.message.includes('foreign key constraint')) {
        mensajeError = '⚠️ No se puede eliminar este jugador porque tiene goles o partidos asociados. Elimina esos registros primero.'
      }
      
      alert(mensajeError)
      return
    }

    console.log('✅ Jugador eliminado exitosamente')
    alert('Jugador eliminado correctamente')
    getJugadores()
  }

  async function postJugador(e){
    e.preventDefault()

    // Validar que no estén vacíos
    if (!nombre || !posicion || !dorsal || !equipo) {
      alert('⚠️ Por favor completa todos los campos')
      return
    }

    console.log('➕ Agregando nuevo jugador:', {nombre, posicion, dorsal, equipo, activo})

    let {data, error} = await supabase.from('jugadores').insert({ 
                                    nombre: nombre, 
                                    posicion: posicion, 
                                    dorsal: parseInt(dorsal),
                                    equipo: equipo,
                                    activo: activo})

    if(error){
      console.error('❌ Error al insertar jugador:', error)
      alert('❌ Error al agregar jugador: ' + error.message)
      return
    }

    console.log('✅ Jugador insertado exitosamente')
    alert('✅ Jugador agregado correctamente')
    
    // Limpiar formulario
    setNombre("")
    setPosicion("")
    setDorsal("")
    setEquipo("")
    setActivo(true)
    setEditarJugador(false)
    
    getJugadores()
  }

  function putJugador(jugador) {
    // Carga los datos del jugador en el formulario para editar
    console.log('📝 Cargando jugador para editar:', jugador)
    setNombre(jugador.nombre)
    setPosicion(jugador.posicion)
    setDorsal(jugador.dorsal)
    setEquipo(jugador.equipo)
    setActivo(jugador.activo)
    setJugadorId(jugador.id)
    setEditarJugador(true)
  }

  async function updateJugador(e){
    e.preventDefault()

    // Validar que no estén vacíos
    if (!nombre || !posicion || !dorsal || !equipo) {
      alert('⚠️ Por favor completa todos los campos')
      return
    }

    console.log('✏️ Actualizando jugador con ID:', jugadorId)

    let {data, error} = await supabase.from('jugadores').update({
                                    nombre: nombre,
                                    posicion: posicion,
                                    dorsal: parseInt(dorsal),
                                    equipo: equipo,
                                    activo: activo
                                    }).eq('id', jugadorId)

    if(error){
      console.error('❌ Error al actualizar jugador:', error)
      alert('❌ Error al actualizar jugador: ' + error.message)
      return
    }

    console.log('✅ Jugador actualizado exitosamente')
    alert("✅ Jugador actualizado correctamente")
    
    // Limpiar formulario
    setNombre("")
    setPosicion("")
    setDorsal("")
    setEquipo("")
    setActivo(true)
    setEditarJugador(false)
    
    getJugadores()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">⚽ Gestión de Jugadores</h1>
          <p className="text-gray-600">Administra el plantel de tu equipo</p>
        </div>

        {/* Botón Recargar */}
        <div className="mb-6">
          <button 
            onClick={getJugadores}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 flex items-center gap-2"
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
            <p className="font-semibold">⏳ Cargando jugadores...</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Formulario */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editarJugador ? '✏️ Editar Jugador' : '➕ Nuevo Jugador'}
              </h2>
              
              <form onSubmit={editarJugador ? updateJugador : postJugador} className="space-y-4">
                <div>
                  <input 
                    type="text" 
                    placeholder="Nombre completo"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <input 
                    type="text" 
                    placeholder="Posición (Delantero, Medio, etc)"
                    value={posicion}
                    onChange={e => setPosicion(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <input 
                    type="number" 
                    placeholder="Dorsal" 
                    value={dorsal}  
                    onChange={e => setDorsal(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <input 
                    type="text" 
                    placeholder="Equipo"
                    value={equipo}
                    onChange={e => setEquipo(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                  <input 
                    type="checkbox" 
                    checked={activo}
                    onChange={e => setActivo(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-gray-700 font-medium">Jugador Activo</span>
                </label>
                
                <button 
                  type="submit"
                  className={`w-full font-semibold py-3 px-4 rounded-lg transition duration-200 text-white ${
                    editarJugador 
                      ? 'bg-yellow-600 hover:bg-yellow-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {editarJugador ? '💾 Actualizar Jugador' : '✅ Agregar Jugador'}
                </button>
              </form>
            </div>
          </div>

          {/* Tabla de Jugadores */}
          <div className="lg:col-span-2">
            {!cargando && jugadores.length === 0 && !error && (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-2xl text-gray-500">📭 No hay jugadores registrados aún</p>
              </div>
            )}

            {jugadores.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                  <h2 className="text-white text-xl font-bold">
                    📊 Total: {jugadores.length} jugadores
                  </h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 border-b-2 border-gray-300">
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">Nombre</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">Posición</th>
                        <th className="px-6 py-3 text-center text-gray-700 font-semibold">Dorsal</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">Equipo</th>
                        <th className="px-6 py-3 text-center text-gray-700 font-semibold">Estado</th>
                        <th className="px-6 py-3 text-center text-gray-700 font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        jugadores.map((jugador, index) => (
                          <tr 
                            key={jugador.id} 
                            className={`border-b transition hover:bg-blue-50 ${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                          >
                            <td className="px-6 py-4 text-gray-800 font-medium">{jugador.nombre}</td>
                            <td className="px-6 py-4 text-gray-600">{jugador.posicion}</td>
                            <td className="px-6 py-4 text-center">
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                                #{jugador.dorsal}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{jugador.equipo}</td>
                            <td className="px-6 py-4 text-center">
                              <span className="text-2xl">
                                {jugador.activo ? '✅' : '❌'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center space-x-2">
                              <button 
                                onClick={()=>putJugador(jugador)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 inline-block text-sm"
                              >
                                ✏️ Editar
                              </button>
                              <button 
                                onClick={()=>deleteJugador(jugador.id)}
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
