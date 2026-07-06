import { createClient } from "@supabase/supabase-js"
import { useState, useEffect } from "react"

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)

export default function Goleadores() {

  const [goles, setGoles] = useState([])
  const [partidos, setPartidos] = useState([])
  const [jugadores, setJugadores] = useState([])
  const [partidoId, setPartidoId] = useState("")
  const [jugadorId, setJugadorId] = useState("")
  const [minuto, setMinuto] = useState("")
  const [esPenal, setEsPenal] = useState(false)
  const [golId, setGolId] = useState("")
  const [editarGol, setEditarGol] = useState(false)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Al montar el componente, traer los goles y los datos para el formulario
    getPartidos()
    getJugadores()
    getGoles()
  }, [])

  // Obtener partidos para el select del formulario
  async function getPartidos() {
    const { data, error } = await supabase
      .from('partidos')
      .select('id, fase, local:equipos!local_id(nombre), visitante:equipos!visitante_id(nombre)')
      .order('id')

    if (error) {
      console.error('❌ Error al traer partidos:', error)
      return
    }
    setPartidos(data || [])
  }

  // Obtener jugadores para el select del formulario
  async function getJugadores() {
    const { data, error } = await supabase.from('jugadores').select('id, nombre').order('nombre')

    if (error) {
      console.error('❌ Error al traer jugadores:', error)
      return
    }
    setJugadores(data || [])
  }

  // Obtener goles con el nombre del jugador y el partido en que se marcaron
  async function getGoles() {
    try {
      setCargando(true)
      setError(null)
      const { data, error } = await supabase
        .from('goles')
        .select('*, jugador:jugadores!jugador_id(nombre), partido:partidos!partido_id(fase, local:equipos!local_id(nombre), visitante:equipos!visitante_id(nombre))')
        .order('minuto')

      if (error) {
        console.error('❌ Error al traer goles:', error)
        setError(error.message)
        return
      }
      console.log('⚽ Todos los goles:', data)
      console.log('📊 Total de goles:', data?.length || 0)
      setGoles(data || [])
    } catch (err) {
      console.error('💥 Error inesperado:', err)
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  async function deleteGol(id) {
    // Confirmación antes de eliminar
    if (!confirm('¿Está seguro de que desea eliminar este gol?')) {
      return
    }

    console.log("🗑️ Eliminando gol con ID:", id)

    let { error } = await supabase.from('goles').delete().eq('id', id)

    if (error) {
      console.error('❌ Error al eliminar gol:', error)
      alert('❌ Error al eliminar gol: ' + error.message)
      return
    }

    console.log('✅ Gol eliminado exitosamente')
    alert('Gol eliminado correctamente')
    getGoles()
  }

  async function postGol(e) {
    e.preventDefault()

    // Validar que no estén vacíos
    if (!partidoId || !jugadorId || minuto === "") {
      alert('⚠️ Por favor completa todos los campos')
      return
    }

    console.log('➕ Agregando nuevo gol:', { partidoId, jugadorId, minuto, esPenal })

    let { data, error } = await supabase.from('goles').insert({
      partido_id: parseInt(partidoId),
      jugador_id: parseInt(jugadorId),
      minuto: parseInt(minuto),
      es_penal: esPenal
    })

    if (error) {
      console.error('❌ Error al insertar gol:', error)
      alert('❌ Error al agregar gol: ' + error.message)
      return
    }

    console.log('✅ Gol insertado exitosamente')
    alert('✅ Gol agregado correctamente')

    limpiarFormulario()
    getGoles()
  }

  function putGol(gol) {
    // Carga los datos del gol en el formulario para editar
    console.log('📝 Cargando gol para editar:', gol)
    setPartidoId(gol.partido_id)
    setJugadorId(gol.jugador_id)
    setMinuto(gol.minuto)
    setEsPenal(gol.es_penal)
    setGolId(gol.id)
    setEditarGol(true)
  }

  async function updateGol(e) {
    e.preventDefault()

    // Validar que no estén vacíos
    if (!partidoId || !jugadorId || minuto === "") {
      alert('⚠️ Por favor completa todos los campos')
      return
    }

    console.log('✏️ Actualizando gol con ID:', golId)

    let { data, error } = await supabase.from('goles').update({
      partido_id: parseInt(partidoId),
      jugador_id: parseInt(jugadorId),
      minuto: parseInt(minuto),
      es_penal: esPenal
    }).eq('id', golId)

    if (error) {
      console.error('❌ Error al actualizar gol:', error)
      alert('❌ Error al actualizar gol: ' + error.message)
      return
    }

    console.log('✅ Gol actualizado exitosamente')
    alert("✅ Gol actualizado correctamente")

    limpiarFormulario()
    getGoles()
  }

  function limpiarFormulario() {
    setPartidoId("")
    setJugadorId("")
    setMinuto("")
    setEsPenal(false)
    setGolId("")
    setEditarGol(false)
  }

  function nombrePartido(partido) {
    if (!partido) return 'N/A'
    return `${partido.local?.nombre || '?'} vs ${partido.visitante?.nombre || '?'}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🏆 Tabla de Goleadores</h1>
          <p className="text-gray-600">Registro de todos los goles del torneo mundial</p>
        </div>

        {/* Botón Recargar */}
        <div className="mb-6">
          <button
            onClick={getGoles}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 flex items-center gap-2"
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
            <p className="font-semibold">⏳ Cargando goles...</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Formulario */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editarGol ? '✏️ Editar Gol' : '➕ Nuevo Gol'}
              </h2>

              <form onSubmit={editarGol ? updateGol : postGol} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Partido</label>
                  <select
                    value={partidoId}
                    onChange={e => setPartidoId(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Selecciona un partido</option>
                    {partidos.map(p => (
                      <option key={p.id} value={p.id}>{nombrePartido(p)} ({p.fase})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Jugador</label>
                  <select
                    value={jugadorId}
                    onChange={e => setJugadorId(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Selecciona un jugador</option>
                    {jugadores.map(j => (
                      <option key={j.id} value={j.id}>{j.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Minuto</label>
                  <input
                    type="number"
                    min="0"
                    max="130"
                    placeholder="Minuto del gol"
                    value={minuto}
                    onChange={e => setMinuto(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                  <input
                    type="checkbox"
                    checked={esPenal}
                    onChange={e => setEsPenal(e.target.checked)}
                    className="w-5 h-5 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                  />
                  <span className="text-gray-700 font-medium">Gol de penal</span>
                </label>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className={`w-full font-semibold py-3 px-4 rounded-lg transition duration-200 text-white ${
                      editarGol
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {editarGol ? '💾 Actualizar Gol' : '✅ Agregar Gol'}
                  </button>
                  {editarGol && (
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

          {/* Tabla de Goles */}
          <div className="lg:col-span-2">
            {!cargando && goles.length === 0 && !error && (
              <div className="bg-white rounded-lg shadow-lg p-8 text-center">
                <p className="text-2xl text-gray-500">📭 No hay goles registrados aún</p>
              </div>
            )}

            {goles.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
                  <h2 className="text-white text-xl font-bold">
                    ⚽ Total: {goles.length} goles
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-100 border-b-2 border-gray-300">
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">Jugador</th>
                        <th className="px-6 py-3 text-left text-gray-700 font-semibold">Partido</th>
                        <th className="px-6 py-3 text-center text-gray-700 font-semibold">Minuto</th>
                        <th className="px-6 py-3 text-center text-gray-700 font-semibold">Tipo</th>
                        <th className="px-6 py-3 text-center text-gray-700 font-semibold">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {
                        goles.map((gol, index) => (
                          <tr
                            key={gol.id}
                            className={`border-b transition hover:bg-purple-50 ${
                              index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                            }`}
                          >
                            <td className="px-6 py-4 text-gray-800 font-medium">{gol.jugador?.nombre || 'N/A'}</td>
                            <td className="px-6 py-4 text-gray-600">{nombrePartido(gol.partido)}</td>
                            <td className="px-6 py-4 text-center">
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-bold">
                                {gol.minuto}'
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="text-sm font-semibold px-3 py-1 rounded-full bg-yellow-100 text-yellow-800">
                                {gol.es_penal ? 'Penal' : 'Normal'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center space-x-2">
                              <button
                                onClick={() => putGol(gol)}
                                className="bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200 inline-block text-sm"
                              >
                                ✏️ Editar
                              </button>
                              <button
                                onClick={() => deleteGol(gol.id)}
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
