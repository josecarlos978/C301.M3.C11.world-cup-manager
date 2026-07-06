import { createClient } from "@supabase/supabase-js"
import { useState, useEffect } from "react"

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)

export default function Posiciones() {

  const [grupos, setGrupos] = useState({})
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Apenas se construya mi componente
    getPosiciones()
  }, [])

  async function getPosiciones() {
    try {
      setCargando(true)
      setError(null)

      const { data: equipos, error: equiposError } = await supabase
        .from('equipos')
        .select('id, nombre, grupo')

      if (equiposError) {
        console.error('❌ Error al traer equipos:', equiposError)
        setError(equiposError.message)
        return
      }

      const { data: partidos, error: partidosError } = await supabase
        .from('partidos')
        .select('local_id, visitante_id, goles_local, goles_visitante')

      if (partidosError) {
        console.error('❌ Error al traer partidos:', partidosError)
        setError(partidosError.message)
        return
      }

      console.log('🏆 Equipos:', equipos)
      console.log('🎮 Partidos:', partidos)

      // Inicializar estadísticas de cada equipo en cero
      const stats = {}
      equipos.forEach(equipo => {
        stats[equipo.id] = {
          id: equipo.id,
          nombre: equipo.nombre,
          grupo: equipo.grupo,
          pj: 0, g: 0, e: 0, p: 0,
          gf: 0, gc: 0, dg: 0, pts: 0
        }
      })

      // Recorrer los partidos y sumar estadísticas para local y visitante
      partidos.forEach(partido => {
        const local = stats[partido.local_id]
        const visitante = stats[partido.visitante_id]

        // Si el equipo del partido ya no existe en la tabla equipos, se ignora
        if (!local || !visitante) return

        local.pj += 1
        visitante.pj += 1
        local.gf += partido.goles_local
        local.gc += partido.goles_visitante
        visitante.gf += partido.goles_visitante
        visitante.gc += partido.goles_local

        if (partido.goles_local > partido.goles_visitante) {
          local.g += 1
          local.pts += 3
          visitante.p += 1
        } else if (partido.goles_local < partido.goles_visitante) {
          visitante.g += 1
          visitante.pts += 3
          local.p += 1
        } else {
          local.e += 1
          visitante.e += 1
          local.pts += 1
          visitante.pts += 1
        }
      })

      // Calcular diferencia de gol y agrupar por grupo
      const porGrupo = {}
      Object.values(stats).forEach(equipo => {
        equipo.dg = equipo.gf - equipo.gc
        const clave = equipo.grupo || 'Sin grupo'
        if (!porGrupo[clave]) porGrupo[clave] = []
        porGrupo[clave].push(equipo)
      })

      // Ordenar cada grupo: puntos > diferencia de gol > goles a favor > nombre
      Object.keys(porGrupo).forEach(clave => {
        porGrupo[clave].sort((a, b) =>
          b.pts - a.pts || b.dg - a.dg || b.gf - a.gf || a.nombre.localeCompare(b.nombre)
        )
      })

      setGrupos(porGrupo)
    } catch (err) {
      console.error('💥 Error inesperado:', err)
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  const gruposOrdenados = Object.keys(grupos).sort()

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-100 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">📋 Tabla de Posiciones</h1>
          <p className="text-gray-600">Clasificación por grupo del torneo mundial</p>
        </div>

        {/* Botón Recargar */}
        <div className="mb-6">
          <button
            onClick={getPosiciones}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-200 flex items-center gap-2"
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
            <p className="font-semibold">⏳ Calculando posiciones...</p>
          </div>
        )}

        {!cargando && gruposOrdenados.length === 0 && !error && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-2xl text-gray-500">📭 No hay equipos registrados aún</p>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {gruposOrdenados.map(grupo => (
            <div key={grupo} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-4">
                <h2 className="text-white text-xl font-bold">🏅 Grupo {grupo}</h2>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100 border-b-2 border-gray-300">
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold">#</th>
                      <th className="px-4 py-3 text-left text-gray-700 font-semibold">Equipo</th>
                      <th className="px-3 py-3 text-center text-gray-700 font-semibold">PJ</th>
                      <th className="px-3 py-3 text-center text-gray-700 font-semibold">G</th>
                      <th className="px-3 py-3 text-center text-gray-700 font-semibold">E</th>
                      <th className="px-3 py-3 text-center text-gray-700 font-semibold">P</th>
                      <th className="px-3 py-3 text-center text-gray-700 font-semibold">GF</th>
                      <th className="px-3 py-3 text-center text-gray-700 font-semibold">GC</th>
                      <th className="px-3 py-3 text-center text-gray-700 font-semibold">DG</th>
                      <th className="px-4 py-3 text-center text-gray-700 font-semibold">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {grupos[grupo].map((equipo, index) => (
                      <tr
                        key={equipo.id}
                        className={`border-b transition hover:bg-teal-50 ${
                          index < 2 ? 'bg-teal-50/50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        }`}
                      >
                        <td className="px-4 py-3 text-gray-500 font-medium">{index + 1}</td>
                        <td className="px-4 py-3 text-gray-800 font-medium">{equipo.nombre}</td>
                        <td className="px-3 py-3 text-center text-gray-600">{equipo.pj}</td>
                        <td className="px-3 py-3 text-center text-gray-600">{equipo.g}</td>
                        <td className="px-3 py-3 text-center text-gray-600">{equipo.e}</td>
                        <td className="px-3 py-3 text-center text-gray-600">{equipo.p}</td>
                        <td className="px-3 py-3 text-center text-gray-600">{equipo.gf}</td>
                        <td className="px-3 py-3 text-center text-gray-600">{equipo.gc}</td>
                        <td className="px-3 py-3 text-center text-gray-600">{equipo.dg > 0 ? `+${equipo.dg}` : equipo.dg}</td>
                        <td className="px-4 py-3 text-center">
                          <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full font-bold">
                            {equipo.pts}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
