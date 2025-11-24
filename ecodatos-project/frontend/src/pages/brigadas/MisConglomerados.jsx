import { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { MapPin, Play, CheckCircle, Eye, Leaf } from 'lucide-react';
import axios from '../../config/axios';
import { API_CONFIG, ENDPOINTS } from '../../config/api';

function MisConglomerados() {
  const [conglomerados, setConglomerados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const esJefeBrigada = usuario.tipo_usuario === 'jefe_brigada';

  useEffect(() => {
    cargarMisConglomerados();
  }, []);

  const cargarMisConglomerados = async () => {
    try {
      setLoading(true);

      // 1. Obtener TODAS las brigadas del usuario
      const respBrigadas = await axios.get(`${API_CONFIG.BRIGADA_SERVICE}${ENDPOINTS.BRIGADA.BASE}/usuario/${usuario.id}/todas`);

      if (!respBrigadas.data.success || respBrigadas.data.data.length === 0) {
        console.log('⚠️ Usuario no tiene brigadas asignadas');
        setConglomerados([]);
        setLoading(false);
        return;
      }

      const brigadasDelUsuario = respBrigadas.data.data;
      const brigadasIds = brigadasDelUsuario.map(b => b.id);
      console.log('📋 Brigadas del usuario:', brigadasIds);

      // 2. Obtener todos los conglomerados
      const response = await axios.get(`${API_CONFIG.CONGLOMERADO_SERVICE}${ENDPOINTS.CONGLOMERADO.BASE}`);

      if (response.data.success) {
        // 3. Filtrar solo los conglomerados de las brigadas del usuario
        const conglomeradosAsignados = response.data.data.filter(c =>
          c.brigada_id &&
          brigadasIds.includes(c.brigada_id) &&
          ['Asignado', 'En_Proceso', 'Completado'].includes(c.estado)
        );

        console.log('🌳 Conglomerados de mis brigadas:', conglomeradosAsignados);
        setConglomerados(conglomeradosAsignados);
      }
    } catch (error) {
      console.error('❌ Error al cargar conglomerados:', error);
    } finally {
      setLoading(false);
    }
  };

  const iniciarTrabajo = async (conglomeradoId) => {
    if (!window.confirm('¿Iniciar trabajo en este conglomerado?')) return;

    try {
      const response = await axios.put(
        `${API_CONFIG.CONGLOMERADO_SERVICE}${ENDPOINTS.CONGLOMERADO.BASE}/${conglomeradoId}/estado`,
        { estado: 'En_Proceso' }
      );

      if (response.data.success) {
        setMensaje('✅ Trabajo iniciado exitosamente');
        setTimeout(() => setMensaje(''), 5000);
        cargarMisConglomerados();
      }
    } catch (error) {
      setMensaje('❌ ' + (error.response?.data?.message || error.message));
      setTimeout(() => setMensaje(''), 8000);
    }
  };

  const completarTrabajo = async (conglomeradoId) => {
    if (!window.confirm('¿Marcar este conglomerado como completado? Esta acción indica que todo el trabajo de campo ha finalizado.')) return;

    try {
      const response = await axios.put(
        `${API_CONFIG.CONGLOMERADO_SERVICE}${ENDPOINTS.CONGLOMERADO.BASE}/${conglomeradoId}/estado`,
        { estado: 'Completado' }
      );

      if (response.data.success) {
        setMensaje('✅ Conglomerado marcado como completado');
        setTimeout(() => setMensaje(''), 3000);
        cargarMisConglomerados();
      }
    } catch (error) {
      setMensaje('❌ ' + (error.response?.data?.message || error.message));
      setTimeout(() => setMensaje(''), 5000);
    }
  };

  const getEstadoColor = (estado) => {
    switch(estado) {
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
            Mis Conglomerados Asignados
          </h1>
          <p className="text-gray-600">
            {esJefeBrigada 
              ? 'Conglomerados asignados a tu brigada. Como Jefe de Brigada puedes gestionar el estado del trabajo.'
              : 'Conglomerados asignados a tu brigada para trabajo de campo.'}
          </p>
        </div>

        {/* Banner de rol */}
        {esJefeBrigada && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
            <p className="text-sm text-blue-800">
              <strong>💼 Jefe de Brigada:</strong> Puedes iniciar y completar el trabajo en los conglomerados asignados.
            </p>
          </div>
        )}

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

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Total Asignados</p>
            <p className="text-2xl font-bold text-gray-800">{conglomerados.length}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">En Proceso</p>
            <p className="text-2xl font-bold text-orange-600">
              {conglomerados.filter(c => c.estado === 'En_Proceso').length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Completados</p>
            <p className="text-2xl font-bold text-green-600">
              {conglomerados.filter(c => c.estado === 'Completado').length}
            </p>
          </div>
        </div>

        {/* Lista de conglomerados */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando conglomerados...</p>
            </div>
          ) : conglomerados.length === 0 ? (
            <div className="p-12 text-center">
              <Leaf size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No tienes conglomerados asignados
              </h3>
              <p className="text-gray-600">
                El coordinador debe asignar conglomerados a tu brigada.
              </p>
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
                      Brigada
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
                  {conglomerados.map((conglomerado) => (
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
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {conglomerado.brigada_nombre || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(conglomerado.estado)}`}>
                          {conglomerado.estado === 'En_Proceso' ? 'En Proceso' : conglomerado.estado}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex gap-2">
                          {/* Botón Ver Detalles - Todos los roles */}
                          <button
                            className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                            title="Ver detalles"
                          >
                            <Eye size={16} />
                          </button>

                          {/* Botones solo para Jefe de Brigada */}
                          {esJefeBrigada && (
                            <>
                              {conglomerado.estado === 'Asignado' && (
                                <button
                                  onClick={() => iniciarTrabajo(conglomerado.id)}
                                  className="text-green-500 hover:text-green-700 flex items-center gap-1"
                                  title="Iniciar trabajo"
                                >
                                  <Play size={16} />
                                  Iniciar
                                </button>
                              )}

                              {conglomerado.estado === 'En_Proceso' && (
                                <button
                                  onClick={() => completarTrabajo(conglomerado.id)}
                                  className="text-green-500 hover:text-green-700 flex items-center gap-1"
                                  title="Completar trabajo"
                                >
                                  <CheckCircle size={16} />
                                  Completar
                                </button>
                              )}
                            </>
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
      </div>
    </Layout>
  );
}

export default MisConglomerados;
