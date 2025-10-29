import { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { Users, UserPlus, Trash2, Edit, CheckCircle, AlertCircle, X } from 'lucide-react';
import axios from 'axios';

function GestionBrigadas() {
  const [brigadas, setBrigadas] = useState([]);
  const [integrantes, setIntegrantes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [brigadaSeleccionada, setBrigadaSeleccionada] = useState(null);
  const [mostrarAsignarIntegrantes, setMostrarAsignarIntegrantes] = useState(false);
  
  const [nuevaBrigada, setNuevaBrigada] = useState({
    nombre: '',
    zona_designada: ''
  });

  const [integrantesSeleccionados, setIntegrantesSeleccionados] = useState([]);

  useEffect(() => {
    cargarBrigadas();
    cargarIntegrantes();
  }, []);

  const cargarBrigadas = async () => {
    try {
      const response = await axios.get('http://localhost:3003/api/brigadas');
      if (response.data.success) {
        setBrigadas(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar brigadas:', error);
    }
  };

  const cargarIntegrantes = async () => {
    try {
      const response = await axios.get('http://localhost:3003/api/brigadas/integrantes');
      if (response.data.success) {
        setIntegrantes(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar integrantes:', error);
    }
  };

  const handleCrearBrigada = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    try {
      const response = await axios.post('http://localhost:3003/api/brigadas', nuevaBrigada);

      if (response.data.success) {
        setMensaje('✅ ' + response.data.message);
        setMostrarFormulario(false);
        setNuevaBrigada({ nombre: '', zona_designada: '' });
        cargarBrigadas();
      }
    } catch (error) {
      setMensaje('❌ ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarBrigada = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar la brigada "${nombre}"?\n\nSe eliminarán las asignaciones pero los integrantes se mantendrán en el sistema.`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3003/api/brigadas/${id}`);
      setMensaje('✅ Brigada eliminada exitosamente');
      cargarBrigadas();
    } catch (error) {
      setMensaje('❌ ' + (error.response?.data?.message || error.message));
    }
  };

  const handleSeleccionarBrigada = async (brigada) => {
    setBrigadaSeleccionada(brigada);
    setMostrarAsignarIntegrantes(true);
    
    // Cargar integrantes actuales de la brigada
    try {
      const response = await axios.get(`http://localhost:3003/api/brigadas/${brigada.id}`);
      if (response.data.success && response.data.data.integrantes) {
        setIntegrantesSeleccionados(response.data.data.integrantes.map(i => i.id));
      }
    } catch (error) {
      console.error('Error al cargar integrantes de brigada:', error);
      setIntegrantesSeleccionados([]);
    }
  };

  const handleAsignarIntegrantes = async () => {
    if (!brigadaSeleccionada) return;

    // Validar composición de la brigada
    const integrantesData = integrantes.filter(i => integrantesSeleccionados.includes(i.id));
    const jefes = integrantesData.filter(i => i.rol === 'jefe_brigada').length;
    const botanicos = integrantesData.filter(i => i.rol === 'botanico').length;
    const tecnicos = integrantesData.filter(i => i.rol === 'tecnico_auxiliar').length;
    const coinvestigadores = integrantesData.filter(i => i.rol === 'coinvestigador').length;

    if (jefes !== 1) {
      setMensaje('⚠️ Debe haber EXACTAMENTE 1 Jefe de Brigada');
      return;
    }
    if (botanicos < 1) {
      setMensaje('⚠️ Debe haber al menos 1 Botánico');
      return;
    }
    if (tecnicos < 1) {
      setMensaje('⚠️ Debe haber al menos 1 Técnico Auxiliar');
      return;
    }
    if (coinvestigadores < 1) {
      setMensaje('⚠️ Debe haber al menos 1 Coinvestigador');
      return;
    }

    setLoading(true);
    setMensaje('');

    try {
      // Usar el nuevo endpoint que asigna múltiples
      const response = await axios.post(
        `http://localhost:3003/api/brigadas/${brigadaSeleccionada.id}/asignar-integrantes`,
        { integrantes: integrantesSeleccionados }
      );

      if (response.data.success) {
        const brigadaActiva = response.data.data.brigada_activa;
        setMensaje(
          brigadaActiva 
            ? '✅ Integrantes asignados exitosamente. La brigada está ahora ACTIVA.' 
            : '✅ Integrantes asignados pero la brigada sigue INACTIVA (no cumple requisitos).'
        );
      }
      
      cerrarModal();
      cargarBrigadas();
    } catch (error) {
      setMensaje('❌ ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const cerrarModal = () => {
    setMostrarAsignarIntegrantes(false);
    setBrigadaSeleccionada(null);
    setIntegrantesSeleccionados([]);
  };

  const toggleIntegrante = (id) => {
    if (integrantesSeleccionados.includes(id)) {
      setIntegrantesSeleccionados(integrantesSeleccionados.filter(i => i !== id));
    } else {
      setIntegrantesSeleccionados([...integrantesSeleccionados, id]);
    }
  };

  const getRolColor = (rol) => {
    switch(rol) {
      case 'jefe_brigada': return 'bg-blue-100 text-blue-800';
      case 'botanico': return 'bg-green-100 text-green-800';
      case 'tecnico_auxiliar': return 'bg-yellow-100 text-yellow-800';
      case 'coinvestigador': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRolNombre = (rol) => {
    const nombres = {
      jefe_brigada: 'Jefe de Brigada',
      botanico: 'Botánico',
      tecnico_auxiliar: 'Técnico Auxiliar',
      coinvestigador: 'Coinvestigador'
    };
    return nombres[rol] || rol;
  };

  const getValidacionBrigada = () => {
    const integrantesData = integrantes.filter(i => integrantesSeleccionados.includes(i.id));
    const jefes = integrantesData.filter(i => i.rol === 'jefe_brigada').length;
    const botanicos = integrantesData.filter(i => i.rol === 'botanico').length;
    const tecnicos = integrantesData.filter(i => i.rol === 'tecnico_auxiliar').length;
    const coinvestigadores = integrantesData.filter(i => i.rol === 'coinvestigador').length;

    return {
      jefes,
      botanicos,
      tecnicos,
      coinvestigadores,
      valida: jefes === 1 && botanicos >= 1 && tecnicos >= 1 && coinvestigadores >= 1
    };
  };

  const validacion = mostrarAsignarIntegrantes ? getValidacionBrigada() : null;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Gestión de Brigadas
          </h1>
          <p className="text-gray-600">
            Administra las brigadas de campo y sus integrantes
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Total Brigadas</p>
            <p className="text-2xl font-bold text-gray-800">{brigadas.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Activas</p>
            <p className="text-2xl font-bold text-green-600">
              {brigadas.filter(b => b.activo).length}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Jefes</p>
            <p className="text-2xl font-bold text-blue-600">
              {integrantes.filter(i => i.rol === 'jefe_brigada').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Botánicos</p>
            <p className="text-2xl font-bold text-yellow-600">
              {integrantes.filter(i => i.rol === 'botanico').length}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Técnicos</p>
            <p className="text-2xl font-bold text-orange-600">
              {integrantes.filter(i => i.rol === 'tecnico_auxiliar').length}
            </p>
          </div>
        </div>

        {/* Mensaje */}
        {mensaje && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            mensaje.includes('✅') 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : mensaje.includes('⚠️')
              ? 'bg-yellow-50 border border-yellow-200 text-yellow-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {mensaje}
          </div>
        )}

        {/* Controles */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <button
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
          >
            <UserPlus size={20} />
            {mostrarFormulario ? 'Cancelar' : 'Crear Brigada'}
          </button>
        </div>

        {/* Formulario Crear Brigada */}
        {mostrarFormulario && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold mb-4">Crear Nueva Brigada</h2>
            <form onSubmit={handleCrearBrigada}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre de la Brigada *
                  </label>
                  <input
                    type="text"
                    value={nuevaBrigada.nombre}
                    onChange={(e) => setNuevaBrigada({...nuevaBrigada, nombre: e.target.value})}
                    placeholder="Ej: Brigada Amazonas"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Zona Designada *
                  </label>
                  <input
                    type="text"
                    value={nuevaBrigada.zona_designada}
                    onChange={(e) => setNuevaBrigada({...nuevaBrigada, zona_designada: e.target.value})}
                    placeholder="Ej: Región Amazónica"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg flex items-center gap-2 transition disabled:opacity-50"
                >
                  <UserPlus size={20} />
                  {loading ? 'Creando...' : 'Crear Brigada'}
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Modal Asignar Integrantes */}
        {mostrarAsignarIntegrantes && brigadaSeleccionada && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b sticky top-0 bg-white flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    Asignar Integrantes a {brigadaSeleccionada.nombre}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Selecciona los miembros del equipo
                  </p>
                </div>
                <button
                  onClick={cerrarModal}
                  className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Validación en tiempo real */}
              <div className="p-6 bg-blue-50 border-b">
                <h3 className="font-bold mb-2">Requisitos de composición:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className={`p-2 rounded ${validacion.jefes === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {validacion.jefes === 1 ? <CheckCircle size={16} className="inline mr-1" /> : <AlertCircle size={16} className="inline mr-1" />}
                    Jefe: {validacion.jefes}/1
                  </div>
                  <div className={`p-2 rounded ${validacion.botanicos >= 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {validacion.botanicos >= 1 ? <CheckCircle size={16} className="inline mr-1" /> : <AlertCircle size={16} className="inline mr-1" />}
                    Botánico: {validacion.botanicos} (mín 1)
                  </div>
                  <div className={`p-2 rounded ${validacion.tecnicos >= 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {validacion.tecnicos >= 1 ? <CheckCircle size={16} className="inline mr-1" /> : <AlertCircle size={16} className="inline mr-1" />}
                    Técnico: {validacion.tecnicos} (mín 1)
                  </div>
                  <div className={`p-2 rounded ${validacion.coinvestigadores >= 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {validacion.coinvestigadores >= 1 ? <CheckCircle size={16} className="inline mr-1" /> : <AlertCircle size={16} className="inline mr-1" />}
                    Coinv: {validacion.coinvestigadores} (mín 1)
                  </div>
                </div>
              </div>

              <div className="p-6">
                {integrantes.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users size={48} className="mx-auto mb-3 text-gray-400" />
                    <p>No hay integrantes disponibles.</p>
                    <p className="text-sm">Primero crea usuarios con roles de brigada en "Gestión de Usuarios".</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {integrantes.map((integrante) => (
                      <div
                        key={integrante.id}
                        onClick={() => toggleIntegrante(integrante.id)}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                          integrantesSeleccionados.includes(integrante.id)
                            ? 'border-primary bg-green-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={integrantesSeleccionados.includes(integrante.id)}
                            onChange={() => {}}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{integrante.nombre_apellidos}</h3>
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mt-1 ${getRolColor(integrante.rol)}`}>
                              {getRolNombre(integrante.rol)}
                            </span>
                            {integrante.especialidad && (
                              <p className="text-xs text-gray-600 mt-1">{integrante.especialidad}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 border-t bg-gray-50 flex gap-3">
                <button
                  onClick={handleAsignarIntegrantes}
                  disabled={loading || !validacion.valida || integrantes.length === 0}
                  className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <CheckCircle size={20} />
                  {loading ? 'Asignando...' : 'Asignar Integrantes'}
                </button>
                <button
                  onClick={cerrarModal}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Lista de Brigadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brigadas.map((brigada) => (
            <div key={brigada.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{brigada.nombre}</h3>
                  <p className="text-sm text-gray-600">{brigada.zona_designada}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  brigada.activo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {brigada.activo ? 'Activa' : 'Inactiva'}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleSeleccionarBrigada(brigada)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <Users size={18} />
                  Asignar
                </button>
                <button
                  onClick={() => handleEliminarBrigada(brigada.id, brigada.nombre)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {brigadas.length === 0 && (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No hay brigadas registradas
            </h3>
            <p className="text-gray-600">
              Crea una brigada para comenzar a asignar integrantes
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default GestionBrigadas;
