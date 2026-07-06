import { createClient } from "@supabase/supabase-js"
import { useState, useEffect } from "react"

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY)

export default function Dashboard() {
  const [stats, setStats] = useState({
    equipos: 0,
    jugadores: 0,
    partidos: 0,
    goles: 0
  })
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getEstadisticas()
  }, [])

  async function getEstadisticas() {
    try {
      setCargando(true)
      setError(null)

      console.log('📊 Trayendo estadísticas...')

      // Contar equipos
      const { count: equiposCount, error: equiposError } = await supabase
        .from('equipos')
        .select('*', { count: 'exact', head: true })

      // Contar jugadores
      const { count: jugadoresCount, error: jugadoresError } = await supabase
        .from('jugadores')
        .select('*', { count: 'exact', head: true })

      // Contar partidos
      const { count: partidosCount, error: partidosError } = await supabase
        .from('partidos')
        .select('*', { count: 'exact', head: true })

      // Contar goles
      const { count: golesCount, error: golesError } = await supabase
        .from('goles')
        .select('*', { count: 'exact', head: true })

      if (equiposError || jugadoresError || partidosError || golesError) {
        throw new Error('Error al traer estadísticas')
      }

      setStats({
        equipos: equiposCount || 0,
        jugadores: jugadoresCount || 0,
        partidos: partidosCount || 0,
        goles: golesCount || 0
      })

      console.log('✅ Estadísticas cargadas:', {
        equipos: equiposCount,
        jugadores: jugadoresCount,
        partidos: partidosCount,
        goles: golesCount
      })
    } catch (err) {
      console.error('❌ Error:', err)
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  const promedioGoles = stats.partidos > 0 ? (stats.goles / stats.partidos).toFixed(2) : 0

  const cards = [
    { 
      icon: '🏆', 
      label: 'Total Equipos', 
      value: stats.equipos,
      color: 'from-green-500 to-emerald-600'
    },
    { 
      icon: '⚽', 
      label: 'Total Jugadores', 
      value: stats.jugadores,
      color: 'from-blue-500 to-indigo-600'
    },
    { 
      icon: '🎮', 
      label: 'Total Partidos', 
      value: stats.partidos,
      color: 'from-purple-500 to-pink-600'
    },
    { 
      icon: '⚡', 
      label: 'Total Goles', 
      value: stats.goles,
      color: 'from-yellow-500 to-orange-600'
    },
    { 
      icon: '📊', 
      label: 'Prom. Goles/Partido', 
      value: promedioGoles,
      color: 'from-red-500 to-rose-600'
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-5xl font-bold text-gray-800 mb-3">
            📊 Dashboard del Torneo Mundial
          </h1>
          <p className="text-gray-600 text-lg">
            Resumen en tiempo real de todas las estadísticas del torneo
          </p>
        </div>

        {/* Botón Recargar */}
        <div className="mb-8">
          <button 
            onClick={getEstadisticas}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-200 flex items-center gap-2"
          >
            🔄 Actualizar Estadísticas
          </button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 rounded text-red-700">
            <p className="font-semibold">❌ Error: {error}</p>
          </div>
        )}

        {/* Mensaje de carga */}
        {cargando && (
          <div className="mb-8 p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded text-yellow-700">
            <p className="font-semibold">⏳ Cargando estadísticas...</p>
          </div>
        )}

        {/* Tarjetas de Estadísticas */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-10">
          {cards.map((card) => (
            <div
              key={card.label}
              className={`bg-gradient-to-br ${card.color} rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105 transition-transform`}
            >
              <div className="text-4xl mb-3">{card.icon}</div>
              <p className="text-white text-sm font-medium opacity-90 uppercase tracking-wider mb-2">
                {card.label}
              </p>
              <p className="text-white text-4xl font-bold">
                {card.value}
              </p>
            </div>
          ))}
        </section>

        {/* Información Adicional */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Card de Equipos */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-green-500">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🏆</span>
              <h3 className="text-xl font-bold text-gray-800">Equipos</h3>
            </div>
            <p className="text-4xl font-bold text-green-600 mb-2">{stats.equipos}</p>
            <p className="text-gray-600">Equipos participantes en el torneo</p>
          </div>

          {/* Card de Jugadores */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-blue-500">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">⚽</span>
              <h3 className="text-xl font-bold text-gray-800">Jugadores</h3>
            </div>
            <p className="text-4xl font-bold text-blue-600 mb-2">{stats.jugadores}</p>
            <p className="text-gray-600">Jugadores en el plantel</p>
          </div>

          {/* Card de Partidos y Goles */}
          <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-purple-500">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">🎮</span>
              <h3 className="text-xl font-bold text-gray-800">Partidos</h3>
            </div>
            <p className="text-2xl font-bold text-purple-600 mb-2">{stats.partidos} partidos</p>
            <p className="text-2xl font-bold text-orange-600">{stats.goles} goles</p>
            <p className="text-gray-600 mt-2">Promedio: {promedioGoles} goles por partido</p>
          </div>
        </section>
      </div>
    </div>
  )
}
