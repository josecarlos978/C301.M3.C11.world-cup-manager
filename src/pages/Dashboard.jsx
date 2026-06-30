const cards = [
  { icon: 'groups', label: 'Total Equipos', value: '32' },
  { icon: 'person', label: 'Total Jugadores', value: '736' },
  { icon: 'sports_soccer', label: 'Total Partidos', value: '64' },
  { icon: 'sports_score', label: 'Total Goles', value: '172' },
  { icon: 'analytics', label: 'Prom. Goles/Partido', value: '2.69' },
]

const partidos = [
  { local: 'Argentina', golesLocal: 3, visitante: 'Francia', golesVisitante: 3, fase: 'Final', fecha: '18/12/2022' },
  { local: 'Argentina', golesLocal: 3, visitante: 'Croacia', golesVisitante: 0, fase: 'Semifinal', fecha: '13/12/2022' },
  { local: 'Francia', golesLocal: 2, visitante: 'Marruecos', golesVisitante: 0, fase: 'Semifinal', fecha: '14/12/2022' },
  { local: 'Argentina', golesLocal: 2, visitante: 'Países Bajos', golesVisitante: 2, fase: 'Cuartos de Final', fecha: '09/12/2022' },
  { local: 'Brasil', golesLocal: 1, visitante: 'Croacia', golesVisitante: 1, fase: 'Cuartos de Final', fecha: '09/12/2022' },
]

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-display-lg text-primary">Dashboard</h2>
        <p className="text-body-lg text-on-surface-variant mt-1">
          Resumen del torneo
        </p>
      </div>

      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="w-10 h-10 rounded-lg bg-primary-fixed text-primary flex items-center justify-center mb-4">
              <span className="material-symbols-outlined">{card.icon}</span>
            </div>
            <p className="text-caption text-on-surface-variant uppercase tracking-wider">
              {card.label}
            </p>
            <p className="text-display-lg text-primary mt-1">
              {card.value}
            </p>
          </div>
        ))}
      </section>

      <section>
        <h3 className="text-headline-md text-on-surface mb-4">Últimos Partidos</h3>
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-surface-container text-caption text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">
            <div className="col-span-2">Fecha</div>
            <div className="col-span-6 text-center">Partido</div>
            <div className="col-span-2 text-center">Fase</div>
            <div className="col-span-2 text-right">Resultado</div>
          </div>
          {partidos.map((p, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-outline-variant last:border-0 hover:bg-surface-container-low transition-colors"
            >
              <div className="col-span-2 text-body-md text-on-surface-variant">
                {p.fecha}
              </div>
              <div className="col-span-6 flex justify-center items-center gap-3">
                <span className="text-body-md font-medium text-on-surface text-right">
                  {p.local}
                </span>
                <span className="text-headline-sm text-primary font-bold bg-primary-fixed px-3 py-1 rounded">
                  {p.golesLocal} - {p.golesVisitante}
                </span>
                <span className="text-body-md font-medium text-on-surface text-left">
                  {p.visitante}
                </span>
              </div>
              <div className="col-span-2 text-center">
                <span className="text-caption bg-surface-container-high text-on-surface-variant px-2 py-1 rounded-full">
                  {p.fase}
                </span>
              </div>
              <div className="col-span-2 text-right">
                <span className="text-caption text-on-surface-variant">
                  FT
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
