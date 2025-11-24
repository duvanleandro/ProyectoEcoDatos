import { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { FlaskConical, Plus, Search, Edit, Trash2, X } from 'lucide-react';
import axios from '../../config/axios';
import { API_CONFIG, ENDPOINTS } from '../../config/api';

function GestionEspecies() {
  const [especies, setEspecies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [especieEditando, setEspecieEditando] = useState(null);
  
  const [formData, setFormData] = useState({
    nombre_cientifico: '',
    familia: '',
    genero: '',
    nombre_comun: '',
    descripcion: '',
    usos: '',
    estado_conservacion: 'Estable'
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    try {
      if (especieEditando) {
        // Actualizar
        const response = await axios.put(
          `${API_CONFIG.ESPECIE_SERVICE}${ENDPOINTS.ESPECIE.BASE}/${especieEditando.id}`,
          formData
        );
        if (response.data.success) {
          setMensaje('✅ Especie actualizada exitosamente');
        }
      } else {
        // Crear
        const response = await axios.post(`${API_CONFIG.ESPECIE_SERVICE}${ENDPOINTS.ESPECIE.BASE}`, formData);
        if (response.data.success) {
          setMensaje('✅ Especie creada exitosamente');
        }
      }
      
      resetFormulario();
      cargarEspecies();
    } catch (error) {
      setMensaje('❌ ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEditar = (especie) => {
    setEspecieEditando(especie);
    setFormData({
      nombre_cientifico: especie.nombre_cientifico,
      familia: especie.familia || '',
      genero: especie.genero || '',
      nombre_comun: especie.nombre_comun || '',
      descripcion: especie.descripcion || '',
      usos: especie.usos || '',
      estado_conservacion: especie.estado_conservacion || 'Estable'
    });
    setMostrarFormulario(true);
  };

  const handleEliminar = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar la especie "${nombre}"?`)) return;

    try {
      await axios.delete(`${API_CONFIG.ESPECIE_SERVICE}${ENDPOINTS.ESPECIE.BASE}/${id}`);
      setMensaje('✅ Especie eliminada exitosamente');
      cargarEspecies();
    } catch (error) {
      setMensaje('❌ ' + (error.response?.data?.message || error.message));
    }
  };

  const resetFormulario = () => {
    setFormData({
      nombre_cientifico: '',
      familia: '',
      genero: '',
      nombre_comun: '',
      descripcion: '',
      usos: '',
      estado_conservacion: 'Estable'
    });
    setEspecieEditando(null);
    setMostrarFormulario(false);
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
            Gestión de Especies
          </h1>
          <p className="text-gray-600">
            Catálogo de especies vegetales del inventario forestal
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

        {/* Controles */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              {mostrarFormulario ? <X size={20} /> : <Plus size={20} />}
              {mostrarFormulario ? 'Cancelar' : 'Nueva Especie'}
            </button>

            <div className="flex-1 relative">
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
        </div>

        {/* Formulario */}
        {mostrarFormulario && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold mb-4">
              {especieEditando ? 'Editar Especie' : 'Nueva Especie'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre Científico *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre_cientifico}
                    onChange={(e) => setFormData({...formData, nombre_cientifico: e.target.value})}
                    placeholder="Ej: Ceiba pentandra"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre Común
                  </label>
                  <input
                    type="text"
                    value={formData.nombre_comun}
                    onChange={(e) => setFormData({...formData, nombre_comun: e.target.value})}
                    placeholder="Ej: Ceiba"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Familia
                  </label>
                  <input
                    type="text"
                    value={formData.familia}
                    onChange={(e) => setFormData({...formData, familia: e.target.value})}
                    placeholder="Ej: Malvaceae"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Género
                  </label>
                  <input
                    type="text"
                    value={formData.genero}
                    onChange={(e) => setFormData({...formData, genero: e.target.value})}
                    placeholder="Ej: Ceiba"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Estado de Conservación
                  </label>
                  <select
                    value={formData.estado_conservacion}
                    onChange={(e) => setFormData({...formData, estado_conservacion: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="Estable">Estable</option>
                    <option value="Vulnerable">Vulnerable</option>
                    <option value="En Peligro">En Peligro</option>
                    <option value="En Peligro Crítico">En Peligro Crítico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Usos
                  </label>
                  <input
                    type="text"
                    value={formData.usos}
                    onChange={(e) => setFormData({...formData, usos: e.target.value})}
                    placeholder="Ej: Medicinal, Maderable"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    placeholder="Descripción de la especie..."
                    rows="3"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg flex items-center gap-2 transition disabled:opacity-50"
                >
                  <FlaskConical size={20} />
                  {loading ? 'Guardando...' : (especieEditando ? 'Actualizar' : 'Crear Especie')}
                </button>
                <button
                  type="button"
                  onClick={resetFormulario}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

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
              <thead>
                <tr>
                  <th className="text-left">Nombre Científico</th>
                  <th className="text-left">Nombre Común</th>
                  <th className="text-left">Familia</th>
                  <th className="text-left">Género</th>
                  <th className="text-left">Usos</th>
                  <th className="text-left">Estado</th>
                  <th className="text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {especiesFiltradas.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      No se encontraron especies
                    </td>
                  </tr>
                ) : (
                  especiesFiltradas.map((especie) => (
                    <tr key={especie.id}>
                      <td className="font-medium italic">{especie.nombre_cientifico}</td>
                      <td>{especie.nombre_comun || '-'}</td>
                      <td>{especie.familia || '-'}</td>
                      <td>{especie.genero || '-'}</td>
                      <td className="text-sm">{especie.usos || '-'}</td>
                      <td>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getEstadoColor(especie.estado_conservacion)}`}>
                          {especie.estado_conservacion || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditar(especie)}
                            className="text-blue-500 hover:text-blue-700 flex items-center gap-1"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleEliminar(especie.id, especie.nombre_cientifico)}
                            className="text-red-500 hover:text-red-700 flex items-center gap-1"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default GestionEspecies;
