import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Layout from '../../components/common/Layout';
import { Leaf, CheckCircle, XCircle, Trash2, Eye, EyeOff } from 'lucide-react';
import axios from '../../config/axios';
import { API_CONFIG, ENDPOINTS } from '../../config/api';

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

const iconAsignado = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconEnProceso = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconCompletado = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
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
  const [cantidad, setCantidad] = useState(50);
  const [conglomerados, setConglomerados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [estadisticas, setEstadisticas] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const [modoSeleccion, setModoSeleccion] = useState(false);
  const [seleccionados, setSeleccionados] = useState([]);
  const [mostrarLista, setMostrarLista] = useState(true);
  const [ubicacionSeleccionada, setUbicacionSeleccionada] = useState(null);

  useEffect(() => {
    cargarConglomerados();
    cargarEstadisticas();
  }, []);

  const cargarConglomerados = async () => {
    try {
      const response = await axios.get(`${API_CONFIG.CONGLOMERADO_SERVICE}${ENDPOINTS.CONGLOMERADO.BASE}`);
      if (response.data.success) {
        setConglomerados(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar conglomerados:', error);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const response = await axios.get(`${API_CONFIG.CONGLOMERADO_SERVICE}${ENDPOINTS.CONGLOMERADO.ESTADISTICAS}`);
      if (response.data.success) {
        setEstadisticas(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleGenerar = async () => {
    if (!cantidad || cantidad < 1 || cantidad > 100) {
      setMensaje('❌ La cantidad debe estar entre 1 y 100');
      return;
    }

    setLoading(true);
    setMensaje('');

    try {
      const response = await axios.post(`${API_CONFIG.CONGLOMERADO_SERVICE}${ENDPOINTS.CONGLOMERADO.GENERAR}`, {
        cantidad: parseInt(cantidad)
      });

      if (response.data.success) {
        setMensaje(`✅ ${response.data.message}`);
        cargarConglomerados();
        cargarEstadisticas();
      }
    } catch (error) {
      setMensaje('❌ ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleRecargar = () => {
    cargarConglomerados();
    cargarEstadisticas();
    setMensaje('✅ Datos recargados');
    setTimeout(() => setMensaje(''), 2000);
  };

  const handleAprobar = async (id) => {
    try {
      const response = await axios.put(`${API_CONFIG.CONGLOMERADO_SERVICE}${ENDPOINTS.CONGLOMERADO.BASE}/${id}/aprobar`);
      if (response.data.success) {
        setMensaje('✅ Conglomerado aprobado y subparcelas creadas');
        cargarConglomerados();
        cargarEstadisticas();
        setTimeout(() => setMensaje(''), 3000);
      }
    } catch (error) {
      setMensaje('❌ ' + (error.response?.data?.message || error.message));
    }
  };

  const handleRechazar = async (id) => {
    try {
      const response = await axios.put(`${API_CONFIG.CONGLOMERADO_SERVICE}${ENDPOINTS.CONGLOMERADO.BASE}/${id}/rechazar`);
      if (response.data.success) {
        setMensaje('✅ Conglomerado rechazado');
        cargarConglomerados();
        cargarEstadisticas();
        setTimeout(() => setMensaje(''), 3000);
      }
    } catch (error) {
      setMensaje('❌ ' + (error.response?.data?.message || error.message));
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar este conglomerado? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      const response = await axios.delete(`${API_CONFIG.CONGLOMERADO_SERVICE}${ENDPOINTS.CONGLOMERADO.BASE}/${id}`);
      if (response.data.success) {
        setMensaje('✅ Conglomerado eliminado');
        cargarConglomerados();
        cargarEstadisticas();
        setTimeout(() => setMensaje(''), 3000);
      }
    } catch (error) {
      setMensaje('❌ ' + (error.response?.data?.message || error.message));
    }
  };

  const handleAprobarSeleccionados = async () => {
    if (!window.confirm(`¿Aprobar ${seleccionados.length} conglomerados seleccionados?`)) {
      return;
    }

    setLoading(true);
    let aprobados = 0;
    let errores = 0;

    for (const id of seleccionados) {
      try {
        await axios.put(`${API_CONFIG.CONGLOMERADO_SERVICE}${ENDPOINTS.CONGLOMERADO.BASE}/${id}/aprobar`);
        aprobados++;
      } catch (error) {
        errores++;
      }
    }

    setMensaje(`✅ ${aprobados} aprobados. ${errores} errores.`);
    setSeleccionados([]);
    setModoSeleccion(false);
    cargarConglomerados();
    cargarEstadisticas();
    setLoading(false);
  };

  const handleRechazarSeleccionados = async () => {
    if (!window.confirm(`¿Rechazar ${seleccionados.length} conglomerados seleccionados?`)) {
      return;
    }

    setLoading(true);
    let rechazados = 0;
    let errores = 0;

    for (const id of seleccionados) {
      try {
        await axios.put(`${API_CONFIG.CONGLOMERADO_SERVICE}${ENDPOINTS.CONGLOMERADO.BASE}/${id}/rechazar`);
        rechazados++;
      } catch (error) {
        errores++;
      }
    }

    setMensaje(`✅ ${rechazados} rechazados. ${errores} errores.`);
    setSeleccionados([]);
    setModoSeleccion(false);
    cargarConglomerados();
    cargarEstadisticas();
    setLoading(false);
  };

  const handleEliminarSeleccionados = async () => {
    if (!window.confirm(`¿ELIMINAR ${seleccionados.length} conglomerados? Esta acción no se puede deshacer.`)) {
      return;
    }

    setLoading(true);
    let eliminados = 0;
    let errores = 0;

    for (const id of seleccionados) {
      try {
        await axios.delete(`${API_CONFIG.CONGLOMERADO_SERVICE}${ENDPOINTS.CONGLOMERADO.BASE}/${id}`);
        eliminados++;
      } catch (error) {
        errores++;
      }
    }

    setMensaje(`✅ ${eliminados} eliminados. ${errores} errores.`);
    setSeleccionados([]);
    setModoSeleccion(false);
    cargarConglomerados();
    cargarEstadisticas();
    setLoading(false);
  };

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
  const irAUbicacion = (lat, lon) => {
    setUbicacionSeleccionada([parseFloat(lat), parseFloat(lon)]);
  };

  // Filtrar conglomerados
  const conglomeradosFiltrados = filtroEstado === 'Todos'
    ? conglomerados
    : conglomerados.filter(c => c.estado === filtroEstado);

  // Obtener icono según estado
  const getIcon = (estado) => {
    switch(estado) {
      case 'Aprobado':
        return iconAprobado;
      case 'Asignado':
        return iconAsignado;
      case 'En_Proceso':
        return iconEnProceso;
      case 'Completado':
        return iconCompletado;
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
          <div className="bg-white rounded-lg shadow h-[calc(100vh)] flex flex-col">
            {/* Header del panel */}
            <div className="p-4 border-b flex-shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold text-gray-800">Conglomerados</h2>
                <button
                  onClick={() => setMostrarLista(false)}
                  className="text-gray-500 hover:text-gray-700"
                  title="Ocultar panel"
                >
                  <EyeOff size={20} />
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
                  <option value="Asignado">Asignados ({estadisticas?.asignados || 0})</option>
                  <option value="En_Proceso">En Proceso ({conglomerados.filter(c => c.estado === 'En_Proceso').length})</option>
                  <option value="Completado">Completados ({estadisticas?.completados || 0})</option>
                  <option value="Rechazado">Rechazados ({estadisticas?.rechazados || 0})</option>
                </select>
              </div>

              {/* Acciones en lote */}
              {modoSeleccion && seleccionados.length > 0 && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-semibold mb-2">
                    {seleccionados.length} seleccionados
                  </p>
                  <div className="flex gap-2 flex-wrap">
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

              {/* Toggle modo selección */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => {
                    setModoSeleccion(!modoSeleccion);
                    if (modoSeleccion) setSeleccionados([]);
                  }}
                  className={`px-3 py-1 rounded text-sm ${
                    modoSeleccion ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                  }`}
                >
                  {modoSeleccion ? 'Salir de selección' : 'Modo selección'}
                </button>
                {modoSeleccion && (
                  <button
                    onClick={seleccionarTodos}
                    className="px-3 py-1 rounded text-sm bg-gray-200 text-gray-700"
                  >
                    {seleccionados.length === conglomeradosFiltrados.length ? 'Deseleccionar' : 'Seleccionar'} todos
                  </button>
                )}
              </div>
            </div>

            {/* Lista scrolleable de conglomerados */}
            <div className="flex-1 overflow-y-auto px-3 py-2">
              {conglomeradosFiltrados.map((cong) => (
                <div
                  key={cong.id}
                  className={`border rounded-lg p-3 mb-2 cursor-pointer hover:shadow-md transition ${
                    modoSeleccion && seleccionados.includes(cong.id) ? 'bg-blue-50 border-blue-300' : ''
                  }`}
                  onClick={() => {
                    if (modoSeleccion) {
                      toggleSeleccion(cong.id);
                    } else {
                      irAUbicacion(cong.latitud, cong.longitud);
                    }
                  }}
                >
                  {modoSeleccion && (
                    <input
                      type="checkbox"
                      checked={seleccionados.includes(cong.id)}
                      onChange={() => toggleSeleccion(cong.id)}
                      className="mb-2"
                    />
                  )}
                  
                  <div>
                    <h3 className="font-semibold text-sm">{cong.nombre}</h3>
                    <p className="text-xs text-gray-600">ID: {cong.id}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {cong.latitud}, {cong.longitud}
                    </p>
                    <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                      cong.estado === 'Completado' ? 'bg-purple-100 text-purple-800' :
                      cong.estado === 'En_Proceso' ? 'bg-orange-100 text-orange-800' :
                      cong.estado === 'Aprobado' ? 'bg-green-100 text-green-800' :
                      cong.estado === 'Asignado' ? 'bg-blue-100 text-blue-800' :
                      cong.estado === 'Rechazado' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {cong.estado === 'En_Proceso' ? 'En Proceso' : cong.estado}
                    </span>
                  </div>

                  {/* Eliminar individual */}
                  {!modoSeleccion && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEliminar(cong.id);
                      }}
                      className="mt-2 text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                    >
                      <Trash2 size={12} />
                      Eliminar
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botón para mostrar panel si está oculto */}
        {!mostrarLista && (
          <button
            onClick={() => setMostrarLista(true)}
            className="fixed left-4 top-24 bg-primary text-white p-2 rounded-lg shadow-lg hover:bg-primary-dark transition z-50"
            title="Mostrar panel"
          >
            <Eye size={20} />
          </button>
        )}

        {/* Área Principal - Mapa y Controles */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Generar Conglomerados</h1>
            <p className="text-gray-600">
              Genera conglomerados aleatorios en Colombia y gestiona su aprobación
            </p>
          </div>

          {/* Mensaje */}
          {mensaje && (
            <div className={`mb-4 p-3 rounded-lg text-sm ${
              mensaje.includes('✅') 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {mensaje}
            </div>
          )}

          {/* Controles de Generación */}
          <div className="bg-white p-4 rounded-lg shadow mb-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cantidad de conglomerados a generar
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={cantidad}
                  onChange={(e) => setCantidad(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  placeholder="Ej: 50"
                />
              </div>
              <button
                onClick={handleGenerar}
                disabled={loading}
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition flex items-center gap-2 disabled:opacity-50"
              >
                <Leaf size={20} />
                {loading ? 'Generando...' : 'Generar'}
              </button>
              <button
                onClick={handleRecargar}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
              >
                Recargar
              </button>
            </div>

            {conglomerados.length > 0 && (
              <div className="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                ℹ️ Haz clic en un conglomerado de la lista para verlo en el mapa
              </div>
            )}
          </div>

          {/* Estadísticas */}
          {estadisticas && (
            <div className="grid grid-cols-2 md:grid-cols-7 gap-3 mb-4">
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
              <div className="bg-blue-50 p-3 rounded-lg shadow">
                <p className="text-xs text-gray-600">Asignados</p>
                <p className="text-xl font-bold text-blue-600">{estadisticas.asignados}</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg shadow">
                <p className="text-xs text-gray-600">En Proceso</p>
                <p className="text-xl font-bold text-orange-600">{estadisticas.en_proceso || 0}</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg shadow">
                <p className="text-xs text-gray-600">Completados</p>
                <p className="text-xl font-bold text-purple-600">{estadisticas.completados || 0}</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg shadow">
                <p className="text-xs text-gray-600">Rechazados</p>
                <p className="text-xl font-bold text-red-600">{estadisticas.rechazados}</p>
              </div>
            </div>
          )}

          {/* Mapa */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <MapContainer
              center={[4.5709, -74.2973]}
              zoom={6}
              style={{ height: '600px', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {ubicacionSeleccionada && <FlyToLocation position={ubicacionSeleccionada} />}

              {conglomeradosFiltrados.map((cong) => (
                <Marker
                  key={cong.id}
                  position={[parseFloat(cong.latitud), parseFloat(cong.longitud)]}
                  icon={getIcon(cong.estado)}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold mb-2">{cong.nombre}</h3>
                      <p className="text-sm mb-1">
                        <strong>ID:</strong> {cong.id}
                      </p>
                      <p className="text-sm mb-1">
                        <strong>Coordenadas:</strong><br />
                        {cong.latitud}, {cong.longitud}
                      </p>
                      <p className="text-sm mb-1">
                        <strong>Estado:</strong> <span className={`font-semibold ${
                          cong.estado === 'Completado' ? 'text-purple-600' :
                          cong.estado === 'En_Proceso' ? 'text-orange-600' :
                          cong.estado === 'Aprobado' ? 'text-green-600' :
                          cong.estado === 'Asignado' ? 'text-blue-600' :
                          cong.estado === 'Rechazado' ? 'text-red-600' :
                          'text-yellow-600'
                        }`}>{cong.estado === 'En_Proceso' ? 'En Proceso' : cong.estado}</span>
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
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                          >
                            <XCircle size={14} />
                            Rechazar
                          </button>
                        </div>
                      )}
                      
                      <button
                        onClick={() => handleEliminar(cong.id)}
                        className="mt-2 text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
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
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span>Asignado</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span>En Proceso</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span>Completado</span>
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