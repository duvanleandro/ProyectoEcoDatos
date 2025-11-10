import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { Eye, MapPin, Search } from 'lucide-react';
import axios from '../../config/axios';
import { API_CONFIG, ENDPOINTS } from '../../config/api';

function ListaConglomerados() {
  const navigate = useNavigate();
  const [conglomerados, setConglomerados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('Todos');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  useEffect(() => {
    cargarConglomerados();
  }, []);

  const cargarConglomerados = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_CONFIG.CONGLOMERADO_SERVICE}${ENDPOINTS.CONGLOMERADO.BASE}`);
      
      if (response.data.success) {
        let conglomeradosFiltrados = response.data.data;

        // Si es brigadista, solo mostrar sus conglomerados asignados
        if (['jefe_brigada', 'botanico', 'tecnico_auxiliar', 'coinvestigador'].includes(usuario.tipo_usuario)) {
          console.log('Brigadista - mostrando todos por ahora');
        }

        setConglomerados(conglomeradosFiltrados);
      }
    } catch (error) {
      console.error('Error al cargar conglomerados:', error);
    } finally {
      setLoading(false);
    }
  };

  const conglomeradosFiltrados = conglomerados
    .filter(c => filtroEstado === 'Todos' || c.estado === filtroEstado)
    .filter(c =>
      c.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.municipio?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.departamento?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.brigada_nombre?.toLowerCase().includes(busqueda.toLowerCase())
    );

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'Generado':
        return 'bg-gray-100 text-gray-800';
      case 'Aprobado':
        return 'bg-blue-100 text-blue-800';
      case 'Asignado':
        return 'bg-yellow-100 text-yellow-800';
      case 'En_Proceso':
        return 'bg-orange-100 text-orange-800';
      case 'Completado':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const contarPorEstado = (estado) => {
    return conglomerados.filter(c => c.estado === estado).length;
  };

  // Función para formatear coordenadas (maneja strings y números)
  const formatearCoordenada = (valor) => {
    if (!valor) return '0.00';
    const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
    return isNaN(numero) ? '0.00' : numero.toFixed(2);
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Lista de Conglomerados
          </h1>
          <p className="text-gray-600">
            Visualiza todos los conglomerados registrados en el sistema
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Total Conglomerados</p>
            <p className="text-2xl font-bold text-gray-800">{conglomerados.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Completados</p>
            <p className="text-2xl font-bold text-green-600">
              {contarPorEstado('Completado')}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">En Proceso</p>
            <p className="text-2xl font-bold text-orange-600">
              {contarPorEstado('En_Proceso')}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-600">
              {contarPorEstado('Asignado')}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Aprobados</p>
            <p className="text-2xl font-bold text-blue-600">
              {contarPorEstado('Aprobado')}
            </p>
          </div>
        </div>

        {/* Filtros y Buscador */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Filtro por Estado */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Filtrar por Estado
              </label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Todos">Todos ({conglomerados.length})</option>
                <option value="Pendiente">Pendiente ({contarPorEstado('Pendiente')})</option>
                <option value="Aprobado">Aprobado ({contarPorEstado('Aprobado')})</option>
                <option value="Rechazado">Rechazado ({contarPorEstado('Rechazado')})</option>
                <option value="Asignado">Asignado ({contarPorEstado('Asignado')})</option>
                <option value="En_Proceso">En Proceso ({contarPorEstado('En_Proceso')})</option>
                <option value="Completado">Completado ({contarPorEstado('Completado')})</option>
              </select>
            </div>

            {/* Buscador */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Buscar por nombre, municipio, departamento o brigada..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando conglomerados...</p>
            </div>
          ) : conglomeradosFiltrados.length === 0 ? (
            <div className="p-12 text-center">
              <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No hay conglomerados registrados
              </h3>
              <p className="text-gray-600 mb-4">
                {conglomerados.length === 0 
                  ? 'Comienza generando conglomerados desde el menú principal'
                  : 'No se encontraron resultados para tu búsqueda'}
              </p>
              {conglomerados.length === 0 && ['admin', 'coordinador'].includes(usuario.tipo_usuario) && (
                <button
                  onClick={() => navigate('/conglomerados/registrar')}
                  className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg transition"
                >
                  Generar Conglomerados
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Nombre
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Ubicación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Municipio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Departamento
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Brigada Asignada
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {conglomeradosFiltrados.map((conglomerado) => (
                    <tr key={conglomerado.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {conglomerado.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {conglomerado.nombre || `Conglomerado ${conglomerado.id}`}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          {formatearCoordenada(conglomerado.latitud)}, {formatearCoordenada(conglomerado.longitud)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {conglomerado.municipio || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {conglomerado.departamento || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {conglomerado.brigada_nombre || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(conglomerado.estado)}`}>
                          {conglomerado.estado === 'En_Proceso' ? 'En Proceso' : conglomerado.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => navigate(`/conglomerados/${conglomerado.id}`)}
                          className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Eye size={16} />
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default ListaConglomerados;
