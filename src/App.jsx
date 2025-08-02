import { useState, useMemo, useRef } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Calendar, Users, MapPin, Clock, Info, Upload, FileSpreadsheet, Download } from 'lucide-react'
import Tooltip from './components/Tooltip.jsx'
import './App.css'

// Datos de ejemplo de voluntarios
const voluntariosDataEjemplo = [
  { nombre: "Juan", apellido: "Pérez", centro: "Sevilla", llegada: "2025-08-01", salida: "2025-08-05" },
  { nombre: "Ana", apellido: "López", centro: "Madrid", llegada: "2025-08-03", salida: "2025-08-07" },
  { nombre: "Carlos", apellido: "García", centro: "Barcelona", llegada: "2025-08-02", salida: "2025-08-06" },
  { nombre: "María", apellido: "Rodríguez", centro: "Valencia", llegada: "2025-08-01", salida: "2025-08-04" },
  { nombre: "Luis", apellido: "Martín", centro: "Sevilla", llegada: "2025-08-04", salida: "2025-08-08" },
  { nombre: "Carmen", apellido: "Sánchez", centro: "Madrid", llegada: "2025-08-02", salida: "2025-08-05" },
  { nombre: "David", apellido: "Fernández", centro: "Barcelona", llegada: "2025-08-03", salida: "2025-08-07" },
  { nombre: "Elena", apellido: "González", centro: "Valencia", llegada: "2025-08-01", salida: "2025-08-06" }
]

function App() {
  const [voluntariosData, setVoluntariosData] = useState(voluntariosDataEjemplo)
  const [centroSeleccionado, setCentroSeleccionado] = useState('todos')
  const [hoveredCell, setHoveredCell] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const fileInputRef = useRef(null)

  // Función para procesar archivo Excel
  const procesarArchivoExcel = async (file) => {
    setIsLoading(true)
    try {
      // Importar la librería xlsx dinámicamente
      const XLSX = await import('xlsx')
      
      const data = await file.arrayBuffer()
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]
      const jsonData = XLSX.utils.sheet_to_json(worksheet)
      
      // Mapear los datos del Excel al formato esperado
      const voluntariosNuevos = jsonData.map((row, index) => {
        // Intentar diferentes nombres de columnas comunes
        const nombre = row.nombre || row.Nombre || row.NOMBRE || row.name || row.Name || ''
        const apellido = row.apellido || row.Apellido || row.APELLIDO || row.apellidos || row.Apellidos || row.surname || row.Surname || ''
        const centro = row.centro || row.Centro || row.CENTRO || row.city || row.City || row.ciudad || row.Ciudad || ''
        
        // Para fechas, intentar diferentes formatos
        let llegada = row.llegada || row.Llegada || row.LLEGADA || row.arrival || row.Arrival || row.inicio || row.Inicio || ''
        let salida = row.salida || row.Salida || row.SALIDA || row.departure || row.Departure || row.fin || row.Fin || ''
        
        // Convertir fechas si es necesario
        if (llegada instanceof Date) {
          llegada = llegada.toISOString().split('T')[0]
        } else if (typeof llegada === 'number') {
          // Excel almacena fechas como números
          const date = new Date((llegada - 25569) * 86400 * 1000)
          llegada = date.toISOString().split('T')[0]
        }
        
        if (salida instanceof Date) {
          salida = salida.toISOString().split('T')[0]
        } else if (typeof salida === 'number') {
          const date = new Date((salida - 25569) * 86400 * 1000)
          salida = date.toISOString().split('T')[0]
        }
        
        return {
          nombre: String(nombre).trim(),
          apellido: String(apellido).trim(),
          centro: String(centro).trim(),
          llegada: String(llegada),
          salida: String(salida)
        }
      }).filter(voluntario => 
        voluntario.nombre && 
        voluntario.apellido && 
        voluntario.centro && 
        voluntario.llegada && 
        voluntario.salida
      )
      
      if (voluntariosNuevos.length === 0) {
        alert('No se encontraron datos válidos en el archivo. Asegúrate de que las columnas se llamen: nombre, apellido, centro, llegada, salida')
        return
      }
      
      setVoluntariosData(voluntariosNuevos)
      setCentroSeleccionado('todos')
      alert(`Se cargaron ${voluntariosNuevos.length} voluntarios correctamente`)
      
    } catch (error) {
      console.error('Error al procesar el archivo:', error)
      alert('Error al procesar el archivo. Asegúrate de que sea un archivo Excel válido (.xlsx, .xls)')
    } finally {
      setIsLoading(false)
    }
  }

  // Manejar selección de archivo
  const manejarSeleccionArchivo = (event) => {
    const file = event.target.files[0]
    if (file) {
      const validTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls
        'text/csv' // .csv
      ]
      
      if (validTypes.includes(file.type) || file.name.endsWith('.xlsx') || file.name.endsWith('.xls') || file.name.endsWith('.csv')) {
        procesarArchivoExcel(file)
      } else {
        alert('Por favor, selecciona un archivo Excel (.xlsx, .xls) o CSV (.csv)')
      }
    }
  }

  // Función para descargar plantilla Excel
  const descargarPlantilla = async () => {
    try {
      const XLSX = await import('xlsx')
      
      const plantillaData = [
        {
          nombre: 'Juan',
          apellido: 'Pérez',
          centro: 'Madrid',
          llegada: '2025-08-01',
          salida: '2025-08-05'
        },
        {
          nombre: 'Ana',
          apellido: 'López',
          centro: 'Barcelona',
          llegada: '2025-08-02',
          salida: '2025-08-06'
        }
      ]
      
      const worksheet = XLSX.utils.json_to_sheet(plantillaData)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Voluntarios')
      
      // Ajustar ancho de columnas
      const colWidths = [
        { wch: 15 }, // nombre
        { wch: 15 }, // apellido
        { wch: 15 }, // centro
        { wch: 12 }, // llegada
        { wch: 12 }  // salida
      ]
      worksheet['!cols'] = colWidths
      
      XLSX.writeFile(workbook, 'plantilla_voluntarios.xlsx')
    } catch (error) {
      console.error('Error al generar la plantilla:', error)
      alert('Error al generar la plantilla')
    }
  }

  // Generar rango de fechas automáticamente
  const rangoFechas = useMemo(() => {
    if (voluntariosData.length === 0) return []
    
    const fechas = voluntariosData.flatMap(v => [new Date(v.llegada), new Date(v.salida)])
    const fechaMin = new Date(Math.min(...fechas))
    const fechaMax = new Date(Math.max(...fechas))
    
    const rango = []
    const fechaActual = new Date(fechaMin)
    
    while (fechaActual <= fechaMax) {
      rango.push(new Date(fechaActual))
      fechaActual.setDate(fechaActual.getDate() + 1)
    }
    
    return rango
  }, [voluntariosData])

  // Filtrar voluntarios por centro
  const voluntariosFiltrados = useMemo(() => {
    return centroSeleccionado === 'todos' 
      ? voluntariosData 
      : voluntariosData.filter(v => v.centro === centroSeleccionado)
  }, [centroSeleccionado, voluntariosData])

  // Obtener centros únicos
  const centros = useMemo(() => {
    const centrosUnicos = [...new Set(voluntariosData.map(v => v.centro))]
    return centrosUnicos.sort()
  }, [voluntariosData])

  // Verificar si un voluntario está disponible en una fecha
  const estaDisponible = (voluntario, fecha) => {
    const llegada = new Date(voluntario.llegada)
    const salida = new Date(voluntario.salida)
    return fecha >= llegada && fecha <= salida
  }

  // Calcular total de voluntarios por día
  const calcularTotalPorDia = (fecha) => {
    return voluntariosFiltrados.filter(v => estaDisponible(v, fecha)).length
  }

  // Formatear fecha para mostrar
  const formatearFecha = (fecha) => {
    return fecha.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit' 
    })
  }

  // Formatear fecha completa para tooltip
  const formatearFechaCompleta = (fecha) => {
    return fecha.toLocaleDateString('es-ES', { 
      weekday: 'long',
      day: 'numeric', 
      month: 'long' 
    })
  }

  // Calcular duración de estancia
  const calcularDuracion = (voluntario) => {
    const llegada = new Date(voluntario.llegada)
    const salida = new Date(voluntario.salida)
    const diferencia = Math.ceil((salida - llegada) / (1000 * 60 * 60 * 24)) + 1
    return diferencia
  }

  // Estadísticas generales
  const estadisticas = useMemo(() => {
    if (voluntariosFiltrados.length === 0) {
      return { totalVoluntarios: 0, duracionPromedio: 0, maxVoluntariosPorDia: 0 }
    }
    
    const totalVoluntarios = voluntariosFiltrados.length
    const duracionPromedio = voluntariosFiltrados.reduce((acc, v) => acc + calcularDuracion(v), 0) / totalVoluntarios
    const maxVoluntariosPorDia = rangoFechas.length > 0 ? Math.max(...rangoFechas.map(fecha => calcularTotalPorDia(fecha))) : 0
    
    return {
      totalVoluntarios,
      duracionPromedio: Math.round(duracionPromedio * 10) / 10,
      maxVoluntariosPorDia
    }
  }, [voluntariosFiltrados, rangoFechas])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-in fade-in-0 slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-600 rounded-lg shadow-lg">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Calendario de Voluntarios
              </h1>
              <p className="text-lg text-blue-600 font-medium">Festival Kadampa</p>
            </div>
          </div>
          
          {/* Controles de carga de datos */}
          <div className="mb-6">
            <Card className="bg-white/70 backdrop-blur-sm border-orange-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileSpreadsheet className="h-5 w-5 text-orange-600" />
                  Gestión de Datos
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isLoading ? 'Procesando...' : 'Subir Excel/CSV'}
                  </Button>
                  
                  <Button
                    onClick={descargarPlantilla}
                    variant="outline"
                    className="border-orange-600 text-orange-600 hover:bg-orange-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Descargar Plantilla
                  </Button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={manejarSeleccionArchivo}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Sube un archivo Excel o CSV con las columnas: nombre, apellido, centro, llegada, salida
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-white/70 backdrop-blur-sm border-blue-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{estadisticas.totalVoluntarios}</p>
                    <p className="text-sm text-gray-600">Voluntarios activos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 backdrop-blur-sm border-green-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{estadisticas.duracionPromedio}</p>
                    <p className="text-sm text-gray-600">Días promedio</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/70 backdrop-blur-sm border-purple-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Info className="h-8 w-8 text-purple-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{estadisticas.maxVoluntariosPorDia}</p>
                    <p className="text-sm text-gray-600">Máximo por día</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              {centroSeleccionado !== 'todos' && (
                <Badge variant="secondary" className="ml-2 animate-in fade-in-0 slide-in-from-left-2 duration-300">
                  <MapPin className="h-3 w-3 mr-1" />
                  {centroSeleccionado}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <label htmlFor="centro-select" className="text-sm font-medium text-gray-700">
                Filtrar por centro:
              </label>
              <Select value={centroSeleccionado} onValueChange={setCentroSeleccionado}>
                <SelectTrigger className="w-48 bg-white/80 backdrop-blur-sm">
                  <SelectValue placeholder="Seleccionar centro" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los centros</SelectItem>
                  {centros.map(centro => (
                    <SelectItem key={centro} value={centro}>
                      {centro}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Calendario */}
        <Card className="shadow-xl bg-white/80 backdrop-blur-sm animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-200">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Disponibilidad de Voluntarios
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <div className="min-w-max">
                <table className="w-full border-collapse">
                  {/* Encabezado con fechas */}
                  <thead>
                    <tr>
                      <th className="sticky left-0 bg-gray-50 border border-gray-200 p-3 text-left font-semibold text-gray-700 w-48 z-20">
                        Voluntario
                      </th>
                      {rangoFechas.map((fecha, index) => (
                        <Tooltip key={index} content={formatearFechaCompleta(fecha)} position="bottom">
                          <th
                            className="border border-gray-200 p-2 text-center font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors cursor-help whitespace-nowrap min-w-[50px]"
                          >
                            {/* ✅ Forzamos inline en el texto de fecha */}
                            <div className="inline-block text-xs">{formatearFecha(fecha)}</div>
                          </th>
                        </Tooltip>
                      ))}
                    </tr>
                  </thead>                 
                  {/* Filas de voluntarios */}
                  <tbody>
                    {voluntariosFiltrados.map((voluntario, voluntarioIndex) => (
                      <tr 
                        key={voluntarioIndex} 
                        className="hover:bg-blue-50 transition-all duration-200 animate-in fade-in-0 slide-in-from-left-2"
                        style={{ animationDelay: `${voluntarioIndex * 100}ms` }}
                      >
                        <td className="sticky left-0 bg-white border border-gray-200 p-3 z-10">
                          <Tooltip
                            content={
                              <div>
                                <div className="font-semibold">{voluntario.nombre} {voluntario.apellido}</div>
                                <div className="text-xs opacity-90">Centro: {voluntario.centro}</div>
                                <div className="text-xs opacity-90">
                                  Llegada: {new Date(voluntario.llegada).toLocaleDateString('es-ES')}
                                </div>
                                <div className="text-xs opacity-90">
                                  Salida: {new Date(voluntario.salida).toLocaleDateString('es-ES')}
                                </div>
                                <div className="text-xs opacity-90">
                                  Duración: {calcularDuracion(voluntario)} días
                                </div>
                              </div>
                            }
                            position="right"
                          >
                            <div className="cursor-help">
                              <div className="font-medium text-gray-900 text-sm">
                                {voluntario.nombre} {voluntario.apellido}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                {voluntario.centro}
                              </div>
                            </div>
                          </Tooltip>
                        </td>
                        {rangoFechas.map((fecha, fechaIndex) => {
                          const disponible = estaDisponible(voluntario, fecha)
                          const cellKey = `${voluntarioIndex}-${fechaIndex}`
                          return (
                            <td 
                              key={fechaIndex} 
                              className={`border border-gray-200 p-2 text-center transition-all duration-300 w-16 ${
                                disponible 
                                  ? 'bg-green-100 hover:bg-green-200 cursor-pointer hover:scale-105' 
                                  : 'bg-gray-50 hover:bg-gray-100'
                              }`}
                              onMouseEnter={() => setHoveredCell(cellKey)}
                              onMouseLeave={() => setHoveredCell(null)}
                            >
                              {disponible && (
                                <Tooltip
                                  content={`${voluntario.nombre} ${voluntario.apellido} disponible el ${formatearFechaCompleta(fecha)}`}
                                  position="top"
                                >
                                  <div className={`w-4 h-4 bg-green-500 rounded-full mx-auto transition-all duration-200 ${
                                    hoveredCell === cellKey ? 'scale-125 shadow-lg' : ''
                                  }`}></div>
                                </Tooltip>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                    
                    {/* Fila de totales */}
                      <tr className="border-t-4 border-blue-300 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <td className="sticky left-0 bg-gradient-to-r from-blue-50 to-indigo-50 border border-gray-200 p-3 font-bold text-blue-900 z-10">
                          Total por día
                        </td>
                        {rangoFechas.map((fecha, fechaIndex) => {
                          const total = calcularTotalPorDia(fecha)
                          return (
                            <Tooltip key={fechaIndex} content={`${total} voluntarios disponibles el ${formatearFechaCompleta(fecha)}`} position="top">
                              <td className="border border-gray-200 p-1 text-center hover:bg-blue-100 transition-colors cursor-help w-12">
                                 <div className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold transition-all duration-200 whitespace-nowrap min-w-[40px] ${
                                  total > 0 ? 'bg-blue-600 text-white hover:scale-110 shadow-md' : 'bg-gray-200 text-gray-500'
                                }`}>
                                  {total}
                                </div>
                              </td>
                            </Tooltip>
                          )
                        })}
                      </tr>

                  </tbody>
                </table>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leyenda mejorada */}
        <div className="mt-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-400">
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Info className="h-5 w-5" />
                Leyenda
              </h3>
              <div className="flex flex-wrap gap-6 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full shadow-sm"></div>
                  <span className="text-sm text-gray-600 font-medium">Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded border shadow-sm"></div>
                  <span className="text-sm text-gray-600 font-medium">No disponible</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">N</div>
                  <span className="text-sm text-gray-600 font-medium">Total de voluntarios por día</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default App

