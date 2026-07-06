# 🏆 World Cup Manager

Aplicación web para gestionar un torneo de fútbol mundial: equipos, jugadores, partidos, tabla de posiciones y goleadores. Construida con **React 19 + Vite**, **Tailwind CSS 4** y **Supabase** (PostgreSQL) como backend.

## Stack técnico

- **React 19** con **React Router 7** (rutas declarativas dentro de un layout compartido)
- **Vite 8** como bundler y servidor de desarrollo
- **Tailwind CSS 4** para estilos
- **Supabase JS v2** (`@supabase/supabase-js`) para leer y escribir directamente en PostgreSQL desde el cliente
- **Oxlint** para linting

## Funcionalidades

La app tiene un layout con sidebar (`src/layout/AppLayout.jsx`) y 6 páginas, todas conectadas a Supabase:

### 📊 Dashboard (`/`)
Resumen en tiempo real del torneo: total de equipos, jugadores, partidos y goles, más el promedio de goles por partido. Cada estadística se obtiene con conteos (`count: 'exact'`) directamente sobre las tablas de Supabase.

### 🏆 Equipos (`/equipos`)
CRUD completo sobre la tabla `equipos` (nombre, grupo, ranking FIFA, confederación):
- Alta con formulario y validación de campos requeridos.
- Edición cargando los datos en el mismo formulario.
- Baja con confirmación y mensaje amigable si el equipo tiene partidos asociados (restricción de clave foránea).
- Listado en tabla con recarga manual.

### ⚽ Jugadores (`/jugadores`)
CRUD completo sobre la tabla `jugadores` (nombre, posición, dorsal, equipo, estado activo/inactivo), con el mismo patrón de alta, edición, baja y listado que Equipos.

### 🎮 Partidos (`/partidos`)
CRUD completo sobre la tabla `partidos` (equipo local, equipo visitante, goles de cada lado, fase y fecha):
- Selects de equipo local/visitante poblados desde la tabla `equipos`, con validación para que no coincidan.
- El listado muestra los nombres de los equipos (no los IDs), resueltos mediante un *join* explícito por clave foránea (`equipos!local_id`, `equipos!visitante_id`), necesario porque `partidos` tiene dos relaciones distintas hacia `equipos`.

### 📋 Posiciones (`/posiciones`)
Tabla de posiciones calculada en el cliente a partir de `equipos` y `partidos`:
- Por cada partido se acumulan partidos jugados, ganados, empatados, perdidos, goles a favor/en contra y puntos (3 por victoria, 1 por empate) de ambos equipos.
- Los equipos se agrupan por su grupo (A, B, C…) y se ordenan por puntos → diferencia de gol → goles a favor → nombre (criterio estándar de desempate FIFA).
- Se resaltan los dos primeros lugares de cada grupo (zona de clasificación).

### 🥇 Goleadores (`/goleadores`)
CRUD completo sobre la tabla `goles` (partido, jugador, minuto, si fue de penal):
- Selects de partido (mostrando "Local vs Visitante") y jugador para registrar cada gol.
- El listado resuelve mediante *joins* anidados el nombre del jugador y el partido (local/visitante) en el que se marcó cada gol.

## Configuración

1. Instalar dependencias:
   ```bash
   pnpm install
   ```
2. Crear un archivo `.env` en la raíz con las credenciales de tu proyecto de Supabase:
   ```
   VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=tu-clave-publica
   ```
3. Las tablas esperadas en Supabase son: `equipos`, `jugadores`, `partidos` (con `local_id`/`visitante_id` referenciando a `equipos`) y `goles` (con `partido_id` y `jugador_id`).

## Scripts

```bash
pnpm dev       # servidor de desarrollo con HMR
pnpm build     # build de producción
pnpm preview   # sirve el build de producción localmente
pnpm lint      # linting con Oxlint
```

## Scripts auxiliares de datos

En la raíz hay utilidades de Node para poblar/verificar datos directamente en Supabase (leen las credenciales desde `.env`):

- `seedEquipos.js`: borra los equipos existentes e inserta un set de 16 equipos de ejemplo.
- `checkEquipos.js`: consulta y muestra un resumen de los equipos registrados.
- `insert_equipos.sql`: mismo set de equipos de ejemplo, listo para ejecutar en el SQL Editor de Supabase.
