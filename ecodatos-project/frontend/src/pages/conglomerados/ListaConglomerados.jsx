import { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { Search, MapPin } from 'lucide-react';

function ListaConglomerados() {
  // Por ahora usamos datos de ejemplo, luego conectaremos con el backend
  const [conglomerados, setConglomerados] = useState([
    {
      id: 1,
      nombre: 'Conglomerado 1',
      ubicacion: '4.71, -74.07',
      municipio: 'Leticia',
      departamento: 'Amazonas',
      brigada_asignada: 'Brigada A',
      estado: 'Completado'
    },
    {
      id: 2,
      nombre: 'Conglomerado 2',
      ubicacion: '6.24, -75.58',
      municipio: 'Nuquí',
      departamento: 'Chocó',
      brigada_asignada: 'Brigada B',
      estado: 'En Proceso'
    },
    {
      id: 3,
      nombre: 'Conglomerado 3',
      ubicacion: '3.45, -76.53',
      municipio: 'San José del Guaviare',
      departamento: 'Guaviare',
      brigada_asignada: 'Brigada C',
      estado: 'Pendiente'
    },
    {
      id: 4,
      nombre: 'Conglomerado 4',
      ubicacion: '10.39, -75.47',
      municipio: 'Florencia',
      departamento: 'Caquetá',
      brigada_asignada: 'Brigada D',
      estado: 'Completado'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConglomerados, setFilteredConglomerados] = useState(conglomerados);

  useEffect(() => {
    const filtered = conglomerados.filter(cong => 
      cong.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cong.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cong.departamento.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredConglomerados(filtered);
  }, [searchTerm, conglomerados]);

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'Completado':
        return 'bg-green-100 text-green-800';
      case 'En Proceso':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pendiente':
        return 'bg-gray-100 text-gray-800';
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
            Lista de Conglomerados
          </h1>
          <p className="text-gray-600">
            Visualiza todos los conglomerados registrados en el sistema
          </p>
        </div>

        {/* Buscador */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar por nombre, municipio o departamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Total Conglomerados</p>
            <p className="text-2xl font-bold text-primary">{conglomerados.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Completados</p>
            <p className="text-2xl font-bold text-green-600">
              {conglomerados.filter(c => c.estado === 'Completado').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">En Proceso</p>
            <p className="text-2xl font-bold text-yellow-600">
              {conglomerados.filter(c => c.estado === 'En Proceso').length}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Pendientes</p>
            <p className="text-2xl font-bold text-gray-600">
              {conglomerados.filter(c => c.estado === 'Pendiente').length}
            </p>
          </div>
        </div>

        {/* Tabla */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">ID</th>
                  <th className="text-left">Nombre</th>
                  <th className="text-left">Ubicación</th>
                  <th className="text-left">Municipio</th>
                  <th className="text-left">Departamento</th>
                  <th className="text-left">Brigada Asignada</th>
                  <th className="text-left">Estado</th>
                  <th className="text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredConglomerados.length > 0 ? (
                  filteredConglomerados.map((cong) => (
                    <tr key={cong.id}>
                      <td>{cong.id}</td>
                      <td className="font-medium">{cong.nombre}</td>
                      <td>
                        <div className="flex items-center gap-1">
                          <MapPin size={14} className="text-gray-400" />
                          <span className="text-sm">{cong.ubicacion}</span>
                        </div>
                      </td>
                      <td>{cong.municipio}</td>
                      <td>{cong.departamento}</td>
                      <td>{cong.brigada_asignada}</td>
                      <td>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(cong.estado)}`}>
                          {cong.estado}
                        </span>
                      </td>
                      <td>
                        <button className="text-primary hover:text-secondary text-sm font-medium">
                          Ver detalles
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-8 text-gray-500">
                      No se encontraron conglomerados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ListaConglomerados;
