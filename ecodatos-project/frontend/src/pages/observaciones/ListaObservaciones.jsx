import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { FileText, Plus, Eye, CheckCircle, Filter, Search } from 'lucide-react';
import axios from 'axios';

function ListaObservaciones() {
  const navigate = useNavigate();
  const [observaciones, setObservaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [estadisticas, setEstadisticas] = useState({ total: 0, validadas: 0, pendientes: 0 });
  const [filtros, setFiltros] = useState({
    busqueda: '',
    validado: ''
  });

  useEffect(() => {
    cargarObservaciones();
    cargarEstadisticas();
  }, []);

  const cargarObservaciones = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3005/api/observaciones');
      if (response.data.success) {
        setObservaciones(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar observaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const cargarEstadisticas = async () => {
    try {
      const response = await axios.get('http://localhost:3005/api/observaciones/estadisticas');
      if (response.data.success) {
        setEstadisticas(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const validarObservacion = async (id) => {
    if (!window.confirm('¿Está seguro de validar esta observación?')) return;

    try {
      const response = await axios.put(`http://localhost:3005/api/observaciones/${id}/validar`, {
        idUsuario: 1 // TODO: Obtener del contexto
      });

      if (response.data.success) {
        alert('✅ Observación validada exitosamente');
        cargarObservaciones();
        cargarEstadisticas();
      }
    } catch (error) {
      alert('❌ Error al validar observación');
      console.error(error);
    }
  };

  const observacionesFiltradas = observaciones.filter(obs => {
    const coincideBusqueda = !filtros.busqueda || 
      obs.observaciones_generales?.toLowerCase().includes(filtros.busqueda.toLowerCase()) ||
      obs.id_conglomerado?.toString().includes(filtros.busqueda);

    const coincideValidado = !filtros.validado || 
      (filtros.validado === 'true' && obs.validado) ||
      (filtros.validado === 'false' && !obs.validado);

    return coincideBusqueda && coincideValidado;
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-800">Observaciones de Campo</h1>
            </div>
            <button
              onClick={() => navigate('/observaciones/registrar')}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Plus className="w-5 h-5" />
              Nueva Observación
            </button>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Total Observaciones</p>
              <p className="text-2xl font-bold text-blue-600">{estadisticas.total}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Validadas</p>
              <p className="text-2xl font-bold text-green-600">{estadisticas.validadas}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-yellow-600">{estadisticas.pendientes}</p>
            </div>
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
            <div>
              <select
                value={filtros.validado}
                onChange={(e) => setFiltros(prev => ({ ...prev, validado: e.target.value }))}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">Todas</option>
                <option value="true">Validadas</option>
                <option value="false">Pendientes</option>
              </select>
            </div>
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
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          obs.validado 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {obs.validado ? 'Validada' : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => navigate(`/observaciones/detalle/${obs.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Ver detalles"
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                          {!obs.validado && (
                            <button
                              onClick={() => validarObservacion(obs.id)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
                              title="Validar"
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
