# Plan de Diseño - Calendario de Voluntarios Kadampa

## Análisis de Requisitos

### Datos de Entrada
```json
[
  { 
    "nombre": "Juan", 
    "apellido": "Pérez", 
    "centro": "Sevilla", 
    "llegada": "2025-08-01", 
    "salida": "2025-08-05" 
  },
  { 
    "nombre": "Ana", 
    "apellido": "López", 
    "centro": "Madrid", 
    "llegada": "2025-08-03", 
    "salida": "2025-08-07" 
  }
]
```

### Funcionalidades Principales
1. **Tabla de calendario**: Filas = voluntarios, Columnas = días del festival
2. **Celdas verdes**: Cuando el voluntario está disponible
3. **Generación automática de fechas**: Del rango mínimo al máximo
4. **Totalizador por día**: Contador de voluntarios disponibles
5. **Hover tooltips**: Mostrar información completa del voluntario
6. **Filtro por centro**: Dropdown para filtrar voluntarios
7. **Diseño responsivo**: Adaptable a móviles con scroll horizontal

## Arquitectura de Componentes

### Componente Principal: `VolunteerCalendar`
- Estado para datos de voluntarios
- Estado para filtro de centro seleccionado
- Lógica para calcular rango de fechas
- Renderizado de la tabla completa

### Componente: `CalendarHeader`
- Título de la aplicación
- Filtro por centro (dropdown)
- Información del rango de fechas

### Componente: `CalendarTable`
- Encabezado con fechas
- Filas de voluntarios
- Totalizador por día

### Componente: `VolunteerRow`
- Información del voluntario
- Celdas de disponibilidad
- Tooltips en hover

### Componente: `DayCell`
- Celda individual del calendario
- Estado disponible/no disponible
- Tooltip con información

## Diseño Visual

### Paleta de Colores
- **Verde principal**: #10B981 (disponible)
- **Gris claro**: #F3F4F6 (no disponible)
- **Azul acento**: #3B82F6 (encabezados)
- **Texto**: #1F2937
- **Fondo**: #FFFFFF

### Tipografía
- **Título**: Inter, 2xl, font-bold
- **Encabezados**: Inter, lg, font-semibold
- **Contenido**: Inter, sm, font-medium

### Layout
- **Contenedor principal**: max-width con padding responsivo
- **Tabla**: overflow-x-auto para scroll horizontal
- **Celdas**: padding uniforme, bordes sutiles
- **Hover effects**: transiciones suaves

## Funcionalidades Técnicas

### Cálculo de Fechas
```javascript
// Encontrar fecha mínima y máxima
const fechaInicio = Math.min(...voluntarios.map(v => new Date(v.llegada)))
const fechaFin = Math.max(...voluntarios.map(v => new Date(v.salida)))

// Generar array de fechas
const fechas = generarRangoFechas(fechaInicio, fechaFin)
```

### Lógica de Disponibilidad
```javascript
const estaDisponible = (voluntario, fecha) => {
  const llegada = new Date(voluntario.llegada)
  const salida = new Date(voluntario.salida)
  return fecha >= llegada && fecha <= salida
}
```

### Filtrado por Centro
```javascript
const voluntariosFiltrados = centro === 'todos' 
  ? voluntarios 
  : voluntarios.filter(v => v.centro === centro)
```

## Responsividad

### Desktop (>= 1024px)
- Tabla completa visible
- Hover effects activos
- Tooltips posicionados

### Tablet (768px - 1023px)
- Scroll horizontal en tabla
- Tooltips adaptados
- Filtros en línea

### Mobile (< 768px)
- Scroll horizontal obligatorio
- Tooltips simplificados
- Filtros apilados verticalmente
- Texto más pequeño pero legible

