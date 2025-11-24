import { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { FlaskConical, Search, Eye } from 'lucide-react';
import axios from '../../config/axios';
import { API_CONFIG, ENDPOINTS } from '../../config/api';

function ConsultaEspecies() {
  const [especies, setEspecies] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [especieSeleccionada, setEspecieSeleccionada] = useState(null);

  useEffect(() => {
    cargarEspecies();
  }, []);

  const cargarEspecies = async () => {
    try {
      const response = await axios.get(`${API_CONFIG.ESPECIE_SERVICE}${ENDPOINTS.ESPECIE.BASE}`);
      if (response.data.success) {
        setEspecies(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar especies:', error);
    }
  };

  const especiesFiltradas = especies.filter(e =>
    e.nombre_cientifico.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.nombre_comun?.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.familia?.toLowerCase().includes(busqueda.toLowerCase()) ||
    e.genero?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'En Peligro':
        return 'bg-red-100 text-red-800';
      case 'Vulnerable':
        return 'bg-yellow-100 text-yellow-800';
      case 'Estable':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Consulta de Especies
          </h1>
          <p className="text-gray-600">
            Catálogo de especies vegetales (solo lectura)
          </p>
        </div>

        {/* Info para laboratorio */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg mb-6">
          <p className="text-sm text-blue-800">
            <strong>Nota:</strong> Como usuario de Laboratorio, puedes consultar el catálogo de especies 
            para realizar clasificaciones taxonómicas. Para agregar o modificar especies, contacta al coordinador o botánico.
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Total Especies</p>
            <p className="text-2xl font-bold text-gray-800">{especies.length}</p>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">En Peligro</p>
            <p className="text-2xl font-bold text-red-600">
              {especies.filter(e => e.estado_conservacion === 'En Peligro').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Vulnerables</p>
            <p className="text-2xl font-bold text-yellow-600">
              {especies.filter(e => e.estado_conservacion === 'Vulnerable').length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Estables</p>
            <p className="text-2xl font-bold text-green-600">
              {especies.filter(e => e.estado_conservacion === 'Estable').length}
            </p>
          </div>
        </div>

        {/* Buscador */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre científico, común, familia o género..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {/* Tabla de Especies */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <FlaskConical size={24} />
              Catálogo de Especies ({especiesFiltradas.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre Científico
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre Común
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Familia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Género
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usos
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {especiesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No se encontraron especies
                    </td>
                  </tr>
                ) : (
                  especiesFiltradas.map((especie) => (
                    <tr key={especie.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium italic">{especie.nombre_cientifico}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {especie.nombre_comun || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {especie.familia || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {especie.genero || '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm">{especie.usos || '-'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(especie.estado_conservacion)}`}>
                          {especie.estado_conservacion || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => setEspecieSeleccionada(especie)}
                          className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                        >
                          <Eye size={16} />
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de detalles */}
        {especieSeleccionada && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold italic">{especieSeleccionada.nombre_cientifico}</h2>
                {especieSeleccionada.nombre_comun && (
                  <p className="text-gray-600">({especieSeleccionada.nombre_comun})</p>
                )}
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Familia</p>
                  <p className="text-gray-900">{especieSeleccionada.familia || 'No especificado'}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700">Género</p>
                  <p className="text-gray-900">{especieSeleccionada.genero || 'No especificado'}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700">Usos</p>
                  <p className="text-gray-900">{especieSeleccionada.usos || 'No especificado'}</p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700">Estado de Conservación</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(especieSeleccionada.estado_conservacion)}`}>
                    {especieSeleccionada.estado_conservacion || 'N/A'}
                  </span>
                </div>

                {especieSeleccionada.descripcion && (
                  <div>
                    <p className="text-sm font-semibold text-gray-700">Descripción</p>
                    <p className="text-gray-900">{especieSeleccionada.descripcion}</p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t bg-gray-50">
                <button
                  onClick={() => setEspecieSeleccionada(null)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default ConsultaEspecies;
