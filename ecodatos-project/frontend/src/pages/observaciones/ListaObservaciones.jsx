import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { FileText, Plus, Eye, CheckCircle, Filter, Search, Camera } from 'lucide-react';
import axios from '../../config/axios';
import { API_CONFIG, ENDPOINTS } from '../../config/api';

function ListaObservaciones() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const [observaciones, setObservaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [estadisticas, setEstadisticas] = useState({ total: 0, sin_enviar: 0, pendientes: 0, validadas: 0 });
  const [filtros, setFiltros] = useState({
    busqueda: '',
    estado: ''
  });

  const esAdmin = ['admin', 'coordinador'].includes(usuario.tipo_usuario);
  const esBrigadista = ['jefe_brigada', 'botanico', 'tecnico_auxiliar', 'coinvestigador'].includes(usuario.tipo_usuario);
  const esLaboratorio = usuario.tipo_usuario === 'laboratorio';

  useEffect(() => {
    cargarObservaciones();
  }, []);

  const cargarObservaciones = async () => {
    setLoading(true);
    try {
      let observacionesFiltradas = [];

      if (esBrigadista) {
        // Brigadistas: Solo sus observaciones (de su brigada)
        const responseBrigada = await axios.get(`${API_CONFIG.BRIGADA_SERVICE}${ENDPOINTS.BRIGADA.BASE}/usuario/${usuario.id}`);

        if (responseBrigada.data.success && responseBrigada.data.data) {
          const idBrigada = responseBrigada.data.data.id;
          const response = await axios.get(`${API_CONFIG.OBSERVACION_SERVICE}${ENDPOINTS.OBSERVACION.BASE}/brigada/${idBrigada}`);

          if (response.data.success) {
            observacionesFiltradas = response.data.data;
          }
        }
      } else if (esAdmin) {
        // Admin: Solo observaciones enviadas por jefe (validado_por_jefe = true)
        const response = await axios.get(`${API_CONFIG.OBSERVACION_SERVICE}${ENDPOINTS.OBSERVACION.BASE}`);

        if (response.data.success) {
          observacionesFiltradas = response.data.data.filter(obs => obs.validado_por_jefe === true);
        }
      } else if (esLaboratorio) {
        // Laboratorio: Solo observaciones validadas (validado = true)
        const response = await axios.get(`${API_CONFIG.OBSERVACION_SERVICE}${ENDPOINTS.OBSERVACION.BASE}`);

        if (response.data.success) {
          observacionesFiltradas = response.data.data.filter(obs => obs.validado === true);
        }
      }

      setObservaciones(observacionesFiltradas);
      calcularEstadisticas(observacionesFiltradas);
    } catch (error) {
      console.error('Error al cargar observaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const calcularEstadisticas = (obs) => {
    const sin_enviar = obs.filter(o => !o.validado_por_jefe).length;
    const pendientes = obs.filter(o => o.validado_por_jefe && !o.validado).length;
    const validadas = obs.filter(o => o.validado).length;

    setEstadisticas({
      total: obs.length,
      sin_enviar,
      pendientes,
      validadas
    });
  };

  const validarPorAdmin = async (id) => {
    if (!window.confirm('¿Está seguro de realizar la validación final? Esta acción es irreversible.')) return;

    try {
      const response = await axios.put(`${API_CONFIG.OBSERVACION_SERVICE}${ENDPOINTS.OBSERVACION.BASE}/${id}/validar-admin`, {
        idUsuario: usuario.id
      });

      if (response.data.success) {
        alert('✅ Observación validada y cerrada exitosamente');
        cargarObservaciones();
      }
    } catch (error) {
      alert('❌ Error: ' + (error.response?.data?.message || error.message));
      console.error(error);
    }
  };

  const getEstadoBadge = (obs) => {
    if (obs.validado) {
      return <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        Validada
      </span>;
    } else if (obs.validado_por_jefe) {
      return <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
        Pendiente
      </span>;
    } else {
      return <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
        Sin Enviar
      </span>;
    }
  };

  const observacionesFiltradas = observaciones.filter(obs => {
    const coincideBusqueda = !filtros.busqueda || 
      obs.observaciones_generales?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      obs.id_conglomerado?.toString().includes(filtros.busqueda);

    let coincideEstado = true;
    if (filtros.estado === 'sin_enviar') {
      coincideEstado = !obs.validado_por_jefe;
    } else if (filtros.estado === 'pendiente') {
      coincideEstado = obs.validado_por_jefe && !obs.validado;
    } else if (filtros.estado === 'validada') {
      coincideEstado = obs.validado;
    }

    return coincideBusqueda && coincideEstado;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-800">
                {esBrigadista ? 'Mis Observaciones' : esLaboratorio ? 'Observaciones Validadas' : 'Observaciones para Revisión'}
              </h1>
            </div>
            {esBrigadista && (
              <button
                onClick={() => navigate('/observaciones/registrar')}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus className="w-5 h-5" />
                Nueva Observación
              </button>
            )}
          </div>

          {/* Estadísticas */}
          <div className={`grid grid-cols-1 gap-4 ${esLaboratorio ? 'md:grid-cols-1' : 'md:grid-cols-4'}`}>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">{esLaboratorio ? 'Total Observaciones Validadas' : 'Total Observaciones'}</p>
              <p className="text-2xl font-bold text-blue-600">{estadisticas.total}</p>
            </div>
            {!esLaboratorio && (
              <>
                {esBrigadista && (
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Sin Enviar</p>
                    <p className="text-2xl font-bold text-yellow-600">{estadisticas.sin_enviar}</p>
                  </div>
                )}
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Pendientes</p>
                  <p className="text-2xl font-bold text-orange-600">{estadisticas.pendientes}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Validadas</p>
                  <p className="text-2xl font-bold text-green-600">{estadisticas.validadas}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por conglomerado o descripción..."
                  value={filtros.busqueda}
                  onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
            {!esLaboratorio && (
              <div>
                <select
                  value={filtros.estado}
                  onChange={(e) => setFiltros(prev => ({ ...prev, estado: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Todos los estados</option>
                  {esBrigadista && <option value="sin_enviar">Sin Enviar</option>}
                  <option value="pendiente">Pendientes</option>
                  <option value="validada">Validadas</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Cargando observaciones...
            </div>
          ) : observacionesFiltradas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No se encontraron observaciones
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-600 text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Conglomerado</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Fecha</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Temperatura</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Clima</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Fotos</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">Estado</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {observacionesFiltradas.map((obs) => (
                    <tr key={obs.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{obs.id}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        Conglomerado #{obs.id_conglomerado}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {new Date(obs.fecha_observacion).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {obs.temperatura ? `${obs.temperatura}°C` : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {obs.condiciones_clima || '-'}
                      </td>
                      <td className="px-6 py-4 text-center">
  <div className="flex items-center justify-center gap-1">
    <Camera className="w-4 h-4 text-gray-500" />
    <span className="text-sm text-gray-700">
      {obs.fotos && obs.fotos.length > 0 ? obs.fotos.length : 0}
    </span>
  </div>
</td>
                      <td className="px-6 py-4">
                        {getEstadoBadge(obs)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
onClick={() => {
  if (esAdmin && !obs.validado) {
    navigate(`/observaciones/editar/${obs.id}`);
  } else {
    navigate(`/observaciones/detalle/${obs.id}`);
  }
}}                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Ver detalles"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          {esAdmin && !obs.validado && (
                            <button
                              onClick={() => validarPorAdmin(obs.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Validación Final"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-600 text-center">
          Mostrando {observacionesFiltradas.length} de {observaciones.length} observaciones
        </div>
      </div>
    </Layout>
  );
}

export default ListaObservaciones;
