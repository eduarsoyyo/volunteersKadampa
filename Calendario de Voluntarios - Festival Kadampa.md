# Calendario de Voluntarios - Festival Kadampa

Una aplicación web moderna y responsiva para gestionar y visualizar la disponibilidad de voluntarios durante un festival Kadampa.

## 🌟 Características

### Funcionalidades Principales
- **Calendario Visual**: Tabla interactiva que muestra la disponibilidad de cada voluntario por día
- **Filtrado por Centro**: Dropdown para filtrar voluntarios por centro Kadampa
- **Estadísticas en Tiempo Real**: Métricas automáticas de voluntarios activos, duración promedio y máximo por día
- **Totalizador por Día**: Contador que muestra cuántos voluntarios están disponibles cada día
- **Tooltips Informativos**: Información detallada al hacer hover sobre elementos
- **Diseño Responsivo**: Adaptable a dispositivos móviles con scroll horizontal

### Características Técnicas
- **React 18** con hooks modernos
- **Tailwind CSS** para estilos responsivos
- **shadcn/ui** para componentes de interfaz
- **Lucide React** para iconos
- **Animaciones suaves** con CSS transitions
- **Efectos de vidrio** (backdrop-blur) para un diseño moderno

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js 18+ 
- pnpm (recomendado) o npm

### Instalación
```bash
# Clonar el repositorio
git clone [url-del-repositorio]
cd calendario-voluntarios-kadampa

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm run dev
```

### Construcción para Producción
```bash
# Construir la aplicación
pnpm run build

# Previsualizar la construcción
pnpm run preview
```

## 📊 Estructura de Datos

La aplicación utiliza un array de objetos JSON con la siguiente estructura:

```javascript
[
  {
    "nombre": "Juan",
    "apellido": "Pérez", 
    "centro": "Sevilla",
    "llegada": "2025-08-01",
    "salida": "2025-08-05"
  }
]
```

### Campos Requeridos
- **nombre**: Nombre del voluntario (string)
- **apellido**: Apellido del voluntario (string)
- **centro**: Centro Kadampa de origen (string)
- **llegada**: Fecha de llegada en formato YYYY-MM-DD (string)
- **salida**: Fecha de salida en formato YYYY-MM-DD (string)

## 🎨 Personalización

### Modificar Datos de Voluntarios
Edita el array `voluntariosData` en `src/App.jsx`:

```javascript
const voluntariosData = [
  // Añadir o modificar voluntarios aquí
]
```

### Personalizar Colores
Los colores se pueden modificar en `src/App.css` o usando las clases de Tailwind CSS:

- **Verde disponible**: `bg-green-500`, `bg-green-100`
- **Azul principal**: `bg-blue-600`, `text-blue-600`
- **Gradientes**: `from-blue-50 to-indigo-100`

### Añadir Nuevos Centros
Los centros se generan automáticamente desde los datos. Simplemente añade voluntarios con nuevos centros y aparecerán en el filtro.

## 🔧 Funcionalidades Avanzadas

### Tooltips Personalizados
El componente `Tooltip` en `src/components/Tooltip.jsx` permite tooltips personalizados:

```javascript
<Tooltip content="Información del tooltip" position="top">
  <div>Elemento con tooltip</div>
</Tooltip>
```

### Cálculos Automáticos
- **Rango de fechas**: Se calcula automáticamente desde la fecha mínima hasta la máxima
- **Estadísticas**: Se actualizan en tiempo real según el filtro seleccionado
- **Disponibilidad**: Se determina si la fecha está entre llegada y salida (inclusive)

### Responsividad
- **Desktop**: Vista completa con hover effects
- **Tablet**: Scroll horizontal en la tabla
- **Mobile**: Tabla compacta con scroll horizontal obligatorio

## 📱 Uso de la Interfaz

### Navegación
1. **Estadísticas superiores**: Muestran métricas generales
2. **Filtro por centro**: Dropdown para filtrar voluntarios
3. **Tabla principal**: Calendario de disponibilidad
4. **Leyenda**: Explicación de los elementos visuales

### Interacciones
- **Hover en celdas verdes**: Muestra información del voluntario y fecha
- **Hover en encabezados**: Muestra fecha completa
- **Hover en totales**: Muestra cantidad de voluntarios por día
- **Filtrado**: Actualiza estadísticas y tabla en tiempo real

## 🎯 Casos de Uso

### Gestión de Festivales
- Planificar turnos de trabajo
- Identificar días con pocos voluntarios
- Coordinar llegadas y salidas
- Balancear carga de trabajo por centro

### Análisis de Datos
- Duración promedio de estancia
- Distribución por centros
- Picos de disponibilidad
- Planificación de recursos

## 🛠️ Desarrollo

### Estructura del Proyecto
```
src/
├── components/
│   ├── ui/           # Componentes shadcn/ui
│   └── Tooltip.jsx   # Componente tooltip personalizado
├── App.jsx           # Componente principal
├── App.css           # Estilos globales
└── main.jsx          # Punto de entrada
```

### Scripts Disponibles
- `pnpm run dev`: Servidor de desarrollo
- `pnpm run build`: Construcción para producción
- `pnpm run preview`: Previsualizar construcción
- `pnpm run lint`: Linter ESLint

## 📄 Licencia

Este proyecto está desarrollado para la comunidad Kadampa y puede ser utilizado libremente para fines relacionados con la organización de eventos y festivales.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Para soporte técnico o preguntas sobre la implementación, contacta al equipo de desarrollo del festival.

---

**Desarrollado con ❤️ para la comunidad Kadampa**

