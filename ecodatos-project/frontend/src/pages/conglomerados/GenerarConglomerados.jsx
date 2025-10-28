import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import Layout from '../../components/common/Layout';
import { MapPin, Loader, CheckCircle, XCircle, Trash2, Filter, Square, CheckSquare } from 'lucide-react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para los iconos de Leaflet en React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Iconos personalizados
const iconPendiente = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconAprobado = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconRechazado = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Componente para volar a una posición
function FlyToLocation({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) {
      map.flyTo(position, 13, { duration: 1.5 });
    }
  }, [position, map]);
  return null;
}

function GenerarConglomerados() {
  const [conglomerados, setConglomerados] = useState([]);
  const [conglomeradosFiltrados, setConglomeradosFiltrados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [estadisticas, setEstadisticas] = useState(null);
  const [mensaje, setMensaje] = useState('');
  const [cantidad, setCantidad] = useState(50);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [flyToPosition, setFlyToPosition] = useState(null);
  const [mostrarLista, setMostrarLista] = useState(true);
  const [seleccionados, setSeleccionados] = useState([]);
  const [modoSeleccion, setModoSeleccion] = useState(false);

  useEffect(() => {
    cargarConglomerados();
    cargarEstadisticas();
  }, []);

  useEffect(() => {
    // Filtrar conglomerados según el estado seleccionado
    if (filtroEstado === 'Todos') {
      setConglomeradosFiltrados(conglomerados);
    } else {
      setConglomeradosFiltrados(
        conglomerados.filter(c => c.estado === filtroEstado)
      );
    }
    // Limpiar selección al cambiar filtro
    setSeleccionados([]);
  }, [filtroEstado, conglomerados]);

  // Generar conglomerados
  const handleGenerar = async () => {
    setLoading(true);
    setMensaje('');
    
    try {
      const response = await axios.post('http://localhost:3002/api/conglomerados/generar', {
        cantidad: cantidad
      });

      if (response.data.success) {
        setMensaje(`✅ ${response.data.message}`);
        cargarConglomerados();
        cargarEstadisticas();
      }
    } catch (error) {
      setMensaje('❌ Error al generar conglomerados: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Cargar conglomerados
  const cargarConglomerados = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/conglomerados');
      if (response.data.success) {
        setConglomerados(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar conglomerados:', error);
    }
  };

  // Cargar estadísticas
  const cargarEstadisticas = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/conglomerados/estadisticas');
      if (response.data.success) {
        setEstadisticas(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  // Aprobar conglomerado individual
  const handleAprobar = async (id) => {
    try {
      const response = await axios.put(`http://localhost:3002/api/conglomerados/${id}/aprobar`);
      if (response.data.success) {
        setMensaje(`✅ Conglomerado ${id} aprobado y subparcelas creadas`);
        cargarConglomerados();
        cargarEstadisticas();
      }
    } catch (error) {
      setMensaje('❌ Error al aprobar: ' + error.message);
    }
  };

  // Rechazar conglomerado individual
  const handleRechazar = async (id) => {
    try {
      const response = await axios.put(`http://localhost:3002/api/conglomerados/${id}/rechazar`);
      if (response.data.success) {
        setMensaje(`✅ Conglomerado ${id} rechazado`);
        cargarConglomerados();
        cargarEstadisticas();
      }
    } catch (error) {
      setMensaje('❌ Error al rechazar: ' + error.message);
    }
  };

  // Eliminar conglomerado individual
  const handleEliminar = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este conglomerado?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3002/api/conglomerados/${id}`);
      setMensaje(`✅ Conglomerado ${id} eliminado`);
      cargarConglomerados();
      cargarEstadisticas();
    } catch (error) {
      setMensaje('❌ Error al eliminar: ' + error.message);
    }
  };

  // ACCIONES EN LOTE
  const handleAprobarSeleccionados = async () => {
    if (seleccionados.length === 0) return;
    
    if (!window.confirm(`¿Aprobar ${seleccionados.length} conglomerados?`)) return;

    setLoading(true);
    let exitosos = 0;
    let fallidos = 0;

    for (const id of seleccionados) {
      try {
        await axios.put(`http://localhost:3002/api/conglomerados/${id}/aprobar`);
        exitosos++;
      } catch (error) {
        fallidos++;
      }
    }

    setMensaje(`✅ ${exitosos} aprobados, ${fallidos} fallidos`);
    setSeleccionados([]);
    setModoSeleccion(false);
    cargarConglomerados();
    cargarEstadisticas();
    setLoading(false);
  };

  const handleRechazarSeleccionados = async () => {
    if (seleccionados.length === 0) return;
    
    if (!window.confirm(`¿Rechazar ${seleccionados.length} conglomerados?`)) return;

    setLoading(true);
    let exitosos = 0;
    let fallidos = 0;

    for (const id of seleccionados) {
      try {
        await axios.put(`http://localhost:3002/api/conglomerados/${id}/rechazar`);
        exitosos++;
      } catch (error) {
        fallidos++;
      }
    }

    setMensaje(`✅ ${exitosos} rechazados, ${fallidos} fallidos`);
    setSeleccionados([]);
    setModoSeleccion(false);
    cargarConglomerados();
    cargarEstadisticas();
    setLoading(false);
  };

  const handleEliminarSeleccionados = async () => {
    if (seleccionados.length === 0) return;
    
    if (!window.confirm(`¿Eliminar ${seleccionados.length} conglomerados permanentemente?`)) return;

    setLoading(true);
    let exitosos = 0;
    let fallidos = 0;

    for (const id of seleccionados) {
      try {
        await axios.delete(`http://localhost:3002/api/conglomerados/${id}`);
        exitosos++;
      } catch (error) {
        fallidos++;
      }
    }

    setMensaje(`✅ ${exitosos} eliminados, ${fallidos} fallidos`);
    setSeleccionados([]);
    setModoSeleccion(false);
    cargarConglomerados();
    cargarEstadisticas();
    setLoading(false);
  };

  // Selección
  const toggleSeleccion = (id) => {
    if (seleccionados.includes(id)) {
      setSeleccionados(seleccionados.filter(s => s !== id));
    } else {
      setSeleccionados([...seleccionados, id]);
    }
  };

  const seleccionarTodos = () => {
    if (seleccionados.length === conglomeradosFiltrados.length) {
      setSeleccionados([]);
    } else {
      setSeleccionados(conglomeradosFiltrados.map(c => c.id));
    }
  };

  // Ir a ubicación en el mapa
  const irAUbicacion = (cong) => {
    setFlyToPosition([parseFloat(cong.latitud), parseFloat(cong.longitud)]);
  };

  // Obtener icono según estado
  const getIcon = (estado) => {
    switch(estado) {
      case 'Aprobado':
        return iconAprobado;
      case 'Rechazado':
        return iconRechazado;
      default:
        return iconPendiente;
    }
  };

  return (
    <Layout>
      <div className="max-w-full mx-auto flex gap-4">
        {/* Panel Lateral - Lista de Conglomerados */}
        <div className={`${mostrarLista ? 'w-80' : 'w-0'} transition-all duration-300 overflow-hidden`}>
          <div className="bg-white rounded-lg shadow h-full flex flex-col">
            {/* Header del panel */}
            <div className="p-4 border-b">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-lg">Conglomerados</h2>
                <button
                  onClick={() => {
                    setModoSeleccion(!modoSeleccion);
                    setSeleccionados([]);
                  }}
                  className={`px-3 py-1 rounded text-sm ${
                    modoSeleccion 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {modoSeleccion ? 'Cancelar' : 'Seleccionar'}
                </button>
              </div>
              
              {/* Filtros */}
              <div className="mb-3">
                <label className="text-xs text-gray-600 mb-1 block">Filtrar por estado:</label>
                <select
                  value={filtroEstado}
                  onChange={(e) => setFiltroEstado(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="Todos">Todos ({conglomerados.length})</option>
                  <option value="Pendiente">Pendientes ({estadisticas?.pendientes || 0})</option>
                  <option value="Aprobado">Aprobados ({estadisticas?.aprobados || 0})</option>
                  <option value="Rechazado">Rechazados ({estadisticas?.rechazados || 0})</option>
                </select>
              </div>

              {/* Acciones en lote */}
              {modoSeleccion && seleccionados.length > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold mb-2">
                    {seleccionados.length} seleccionados
                  </p>
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={handleAprobarSeleccionados}
                      disabled={loading}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-xs flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <CheckCircle size={14} />
                      Aprobar todos
                    </button>
                    <button
                      onClick={handleRechazarSeleccionados}
                      disabled={loading}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-xs flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <XCircle size={14} />
                      Rechazar todos
                    </button>
                    <button
                      onClick={handleEliminarSeleccionados}
                      disabled={loading}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <Trash2 size={14} />
                      Eliminar todos
                    </button>
                  </div>
                </div>
              )}

              {/* Seleccionar todos */}
              {modoSeleccion && conglomeradosFiltrados.length > 0 && (
                <button
                  onClick={seleccionarTodos}
                  className="mt-2 w-full bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded text-sm flex items-center justify-center gap-2"
                >
                  {seleccionados.length === conglomeradosFiltrados.length ? (
                    <>
                      <CheckSquare size={16} />
                      Deseleccionar todos
                    </>
                  ) : (
                    <>
                      <Square size={16} />
                      Seleccionar todos
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Lista scrolleable */}
            <div className="flex-1 overflow-y-auto p-2">
              {conglomeradosFiltrados.length === 0 ? (
                <p className="text-center text-gray-500 text-sm py-4">
                  No hay conglomerados {filtroEstado !== 'Todos' && filtroEstado.toLowerCase()}
                </p>
              ) : (
                conglomeradosFiltrados.map((cong) => (
                  <div
                    key={cong.id}
                    className={`mb-2 p-3 border rounded-lg hover:bg-gray-50 transition ${
                      seleccionados.includes(cong.id) ? 'bg-blue-50 border-blue-300' : ''
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {/* Checkbox */}
                      {modoSeleccion && (
                        <input
                          type="checkbox"
                          checked={seleccionados.includes(cong.id)}
                          onChange={() => toggleSeleccion(cong.id)}
                          className="mt-1"
                        />
                      )}

                      {/* Info */}
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => !modoSeleccion && irAUbicacion(cong)}
                      >
                        <h3 className="font-semibold text-sm">{cong.nombre}</h3>
                        <p className="text-xs text-gray-600">ID: {cong.id}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {cong.latitud}, {cong.longitud}
                        </p>
                        <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                          cong.estado === 'Aprobado' ? 'bg-green-100 text-green-800' :
                          cong.estado === 'Rechazado' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {cong.estado}
                        </span>
                      </div>

                      {/* Eliminar individual */}
                      {!modoSeleccion && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEliminar(cong.id);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Panel Principal - Mapa y Controles */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Generar Conglomerados
            </h1>
            <p className="text-gray-600">
              Genera conglomerados aleatorios en Colombia y gestiona su aprobación
            </p>
          </div>

          {/* Controles */}
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={cantidad}
                  onChange={(e) => setCantidad(parseInt(e.target.value))}
                  className="w-20 px-3 py-2 border rounded-lg"
                />
                <button
                  onClick={handleGenerar}
                  disabled={loading}
                  className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 transition disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin" size={18} />
                      Generando...
                    </>
                  ) : (
                    <>
                      <MapPin size={18} />
                      Generar
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={cargarConglomerados}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
              >
                Recargar
              </button>

              <button
                onClick={() => setMostrarLista(!mostrarLista)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
              >
                <Filter size={18} />
                {mostrarLista ? 'Ocultar' : 'Mostrar'} Lista
              </button>
            </div>

            {/* Mensaje */}
            {mensaje && (
              <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                {mensaje}
              </div>
            )}
          </div>

          {/* Estadísticas */}
          {estadisticas && (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-4">
              <div className="bg-white p-3 rounded-lg shadow">
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-800">{estadisticas.total}</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg shadow">
                <p className="text-xs text-gray-600">Pendientes</p>
                <p className="text-xl font-bold text-yellow-600">{estadisticas.pendientes}</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg shadow">
                <p className="text-xs text-gray-600">Aprobados</p>
                <p className="text-xl font-bold text-green-600">{estadisticas.aprobados}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg shadow">
                <p className="text-xs text-gray-600">Rechazados</p>
                <p className="text-xl font-bold text-red-600">{estadisticas.rechazados}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg shadow">
                <p className="text-xs text-gray-600">Asignados</p>
                <p className="text-xl font-bold text-blue-600">{estadisticas.asignados}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg shadow">
                <p className="text-xs text-gray-600">Completados</p>
                <p className="text-xl font-bold text-purple-600">{estadisticas.completados}</p>
              </div>
            </div>
          )}

          {/* Mapa */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <MapContainer
              center={[4.5709, -74.2973]}
              zoom={5}
              style={{ height: '600px', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              <FlyToLocation position={flyToPosition} />
              
              {conglomeradosFiltrados.map((cong) => (
                <Marker
                  key={cong.id}
                  position={[parseFloat(cong.latitud), parseFloat(cong.longitud)]}
                  icon={getIcon(cong.estado)}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-primary mb-2">{cong.nombre}</h3>
                      <p className="text-sm mb-1">
                        <strong>ID:</strong> {cong.id}
                      </p>
                      <p className="text-sm mb-1">
                        <strong>Coordenadas:</strong><br />
                        {cong.latitud}, {cong.longitud}
                      </p>
                      <p className="text-sm mb-1">
                        <strong>Estado:</strong> <span className={`font-semibold ${
                          cong.estado === 'Aprobado' ? 'text-green-600' :
                          cong.estado === 'Rechazado' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>{cong.estado}</span>
                      </p>
                      
                      {cong.estado === 'Pendiente' && (
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => handleAprobar(cong.id)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                          >
                            <CheckCircle size={14} />
                            Aprobar
                          </button>
                          <button
                            onClick={() => handleRechazar(cong.id)}
                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                          >
                            <XCircle size={14} />
                            Rechazar
                          </button>
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleEliminar(cong.id)}
                        className="w-full mt-2 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded text-sm flex items-center justify-center gap-1"
                      >
                        <Trash2 size={14} />
                        Eliminar
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Leyenda */}
          <div className="mt-4 bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">Leyenda:</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                <span>Pendiente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Aprobado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span>Rechazado</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default GenerarConglomerados;
