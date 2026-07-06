import { createClient } from "@supabase/supabase-js"
import { useState, useEffect } from "react"

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)

export default function Partidos() {

  const [partidos, setPartidos] = useState([])
  const [equipos, setEquipos] = useState([])
  const [localId, setLocalId] = useState("")
  const [visitanteId, setVisitanteId] = useState("")
  const [golesLocal, setGolesLocal] = useState("")
  const [golesVisitante, setGolesVisitante] = useState("")
  const [fase, setFase] = useState("")
  const [fecha, setFecha] = useState("")
  const [partidoId, setPartidoId] = useState("")
  const [editarPartido, setEditarPartido] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Apenas se construya mi componente
    getEquipos()
    getPartidos()
  }, [])

  // Obtener equipos para los selects del formulario
  async function getEquipos() {
    const { data, error } = await supabase.from('equipos').select('id, nombre').order('nombre')

    if (error) {
      console.error('❌ Error al traer equipos:', error)
      return
    }
    setEquipos(data || [])
  }

  // Obtener partidos con el nombre de los equipos local y visitante
  async function getPartidos() {
    try {
      setCargando(true)
      setError(null)
      const { data, error } = await supabase
        .from('partidos')
        .select('*, local:equipos!local_id(nombre), visitante:equipos!visitante_id(nombre)')
        .order('fecha', { ascending: false })

      if (error) {
        console.error('❌ Error al traer partidos:', error)
        setError(error.message)
        return
      }
      console.log('🎮 Todos los partidos:', data)
      console.log('📊 Total de partidos:', data?.length || 0)
      setPartidos(data || [])
    } catch (err) {
      console.error('💥 Error inesperado:', err)
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  async function deletePartido(id) {
    // Confirmación antes de eliminar
    if (!confirm('¿Está seguro de que desea eliminar este partido?')) {
      return
    }

    console.log("🗑️ Eliminando partido con ID:", id)

    let { error } = await supabase.from('partidos').delete().eq('id', id)

    if (error) {
      console.error('❌ Error al eliminar partido:', error)

      // Mensajes de error más amigables
      let mensajeError = error.message
      if (error.message.includes('foreign key constraint')) {
        mensajeError = '⚠️ No se puede eliminar este partido porque tiene goles asociados. Elimina los goles primero.'
      }

      alert(mensajeError)
      return
    }

    console.log('✅ Partido eliminado exitosamente')
    alert('Partido eliminado correctamente')
    getPartidos()
  }

  async function postPartido(e) {
    e.preventDefault()

    // Validar que no estén vacíos
    if (!localId || !visitanteId || golesLocal === "" || golesVisitante === "" || !fase || !fecha) {
      alert('⚠️ Por favor completa todos los campos')
      return
    }

    // Validar que el equipo local y visitante no sean el mismo
    if (localId === visitanteId) {
      alert('⚠️ El equipo local y visitante no pueden ser el mismo')
      return
    }

    console.log('➕ Agregando nuevo partido:', { localId, visitanteId, golesLocal, golesVisitante, fase, fecha })

    let { data, error } = await supabase.from('partidos').insert({
      local_id: parseInt(localId),
      visitante_id: parseInt(visitanteId),
      goles_local: parseInt(golesLocal),
      goles_visitante: parseInt(golesVisitante),
      fase: fase,
      fecha: fecha
    })

    if (error) {
      console.error('❌ Error al insertar partido:', error)
      alert('❌ Error al agregar partido: ' + error.message)
      return
    }

    console.log('✅ Partido insertado exitosamente')
    alert('✅ Partido agregado correctamente')

    limpiarFormulario()
    getPartidos()
  }

  function putPartido(partido) {
    // Carga los datos del partido en el formulario para editar
    console.log('📝 Cargando partido para editar:', partido)
    setLocalId(partido.local_id)
    setVisitanteId(partido.visitante_id)
    setGolesLocal(partido.goles_local)
    setGolesVisitante(partido.goles_visitante)
    setFase(partido.fase)
    setFecha(partido.fecha ? partido.fecha.slice(0, 10) : "")
    setPartidoId(partido.id)
    setEditarPartido(true)
  }

  async function updatePartido(e) {
    e.preventDefault()

    // Validar que no estén vacíos
    if (!localId || !visitanteId || golesLocal === "" || golesVisitante === "" || !fase || !fecha) {
      alert('⚠️ Por favor completa todos los campos')
      return
    }

    if (localId === visitanteId) {
      alert('⚠️ El equipo local y visitante no pueden ser el mismo')
      return
    }

    console.log('✏️ Actualizando partido con ID:', partidoId)

    let { data, error } = await supabase.from('partidos').update({
      local_id: parseInt(localId),
      visitante_id: parseInt(visitanteId),
      goles_local: parseInt(golesLocal),
      goles_visitante: parseInt(golesVisitante),
      fase: fase,
      fecha: fecha
    }).eq('id', partidoId)

    if (error) {
      console.error('❌ Error al actualizar partido:', error)
      alert('❌ Error al actualizar partido: ' + error.message)
      return
    }

    console.log('✅ Partido actualizado exitosamente')
    alert("✅ Partido actualizado correctamente")

    limpiarFormulario()
    getPartidos()
  }

  function limpiarFormulario() {
    setLocalId("")
    setVisitanteId("")
    setGolesLocal("")
    setGolesVisitante("")
    setFase("")
    setFecha("")
    setPartidoId("")
    setEditarPartido(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🎮 Gestión de Partidos</h1>
          <p className="text-gray-600">Registra los encuentros del torneo mundial</p>
        </div>

        {/* Botón Recargar */}
        <div className="mb-6">
          <button
            onClick={getPartidos}
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 flex items-center gap-2"
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
            <p className="font-semibold">⏳ Cargando partidos...</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Formulario */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editarPartido ? '✏️ Editar Partido' : '➕ Nuevo Partido'}
              </h2>

              <form onSubmit={editarPartido ? updatePartido : postPartido} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Equipo Local</label>
                  <select
                    value={localId}
                    onChange={e => setLocalId(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Selecciona un equipo</option>
                    {equipos.map(eq => (
                      <option key={eq.id} value={eq.id}>{eq.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Equipo Visitante</label>
                  <select
                    value={visitanteId}
                    onChange={e => setVisitanteId(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">Selecciona un equipo</option>
                    {equipos.map(eq => (
                      <option key={eq.id} value={eq.id}>{eq.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Goles Local</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={golesLocal}
                      onChange={e => setGolesLocal(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Goles Visitante</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={golesVisitante}
                      onChange={e => setGolesVisitante(e.target.value)}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fase</label>
                  <input
                    type="text"
                    placeholder="Fase de grupos, Octavos, etc"
                    value={fase}
                    onChange={e => setFase(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    value={fecha}
                    onChange={e => setFecha(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className={`w-full font-semibold py-3 px-4 rounded-lg transition duration-200 text-white ${
                      editarPartido
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {editarPartido ? '💾 Actualizar Partido' : '✅ Agregar Partido'}
                  </button>
                  {editarPartido && (
                    <button
                      type="button"
                      onClick={limpiarFormulario}
                      className="font-semibold py-3 px-4 rounded-lg transition duration-200 text-gray-700 bg-gray-200 hover:bg-gray-300"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Tabla de Partidos */}
          <div className="lg:col-span-2">
            {!cargando && partidos.length === 0 && !error && (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-2xl text-gray-500">📭 No hay partidos registrados aún</p>
              </div>
            )}

            {partidos.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-orange-600 to-amber-600 px-6 py-4">
                  <h2 className="text-white text-xl font-bold">
                    📊 Total: {partidos.length} partidos
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 border-b-2 border-gray-300">
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">Local</th>
                        <th className="px-6 py-3 text-center text-gray-700 font-semibold">Marcador</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">Visitante</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">Fase</th>
                        <th className="px-6 py-3 text-center text-gray-700 font-semibold">Fecha</th>
                        <th className="px-6 py-3 text-center text-gray-700 font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        partidos.map((partido, index) => (
                          <tr
                            key={partido.id}
                            className={`border-b transition hover:bg-orange-50 ${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                          >
                            <td className="px-6 py-4 text-gray-800 font-medium">{partido.local?.nombre || partido.local_id}</td>
                            <td className="px-6 py-4 text-center">
                              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-bold text-lg">
                                {partido.goles_local} - {partido.goles_visitante}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-800 font-medium">{partido.visitante?.nombre || partido.visitante_id}</td>
                            <td className="px-6 py-4 text-gray-600">{partido.fase}</td>
                            <td className="px-6 py-4 text-center text-gray-600">
                              {partido.fecha ? new Date(partido.fecha).toLocaleDateString() : 'N/A'}
                            </td>
                            <td className="px-6 py-4 text-center space-x-2">
                              <button
                                onClick={() => putPartido(partido)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 inline-block text-sm"
                              >
                                ✏️ Editar
                              </button>
                              <button
                                onClick={() => deletePartido(partido.id)}
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
