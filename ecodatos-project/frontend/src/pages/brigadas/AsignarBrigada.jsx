import { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { Users, MapPin, Loader, CheckCircle, Trash2 } from 'lucide-react';
import axios from 'axios';

function AsignarBrigada() {
  const [brigadas, setBrigadas] = useState([]);
  const [conglomerados, setConglomerados] = useState([]);
  const [brigadaSeleccionada, setBrigadaSeleccionada] = useState('');
  const [conglomeradoSeleccionado, setConglomeradoSeleccionado] = useState('');
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [asignaciones, setAsignaciones] = useState([]);

  useEffect(() => {
    cargarBrigadas();
    cargarConglomeradosAprobados();
    cargarAsignaciones();
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

  const cargarConglomeradosAprobados = async () => {
    try {
      const response = await axios.get('http://localhost:3002/api/conglomerados?estado=Aprobado');
      if (response.data.success) {
        setConglomerados(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar conglomerados:', error);
    }
  };

  const cargarAsignaciones = async () => {
    try {
      // Obtener todas las asignaciones de todas las brigadas
      const brigadasRes = await axios.get('http://localhost:3003/api/brigadas');
      if (!brigadasRes.data.success) return;

      const todasAsignaciones = [];
      for (const brigada of brigadasRes.data.data) {
        const res = await axios.get(`http://localhost:3003/api/brigadas/${brigada.id}/conglomerados`);
        if (res.data.success) {
          res.data.data.forEach(cong => {
            todasAsignaciones.push({
              ...cong,
              brigada_id: brigada.id,
              brigada_nombre: brigada.nombre
            });
          });
        }
      }
      setAsignaciones(todasAsignaciones);
    } catch (error) {
      console.error('Error al cargar asignaciones:', error);
    }
  };

  const handleAsignar = async () => {
    if (!brigadaSeleccionada || !conglomeradoSeleccionado) {
      setMensaje('⚠️ Debes seleccionar una brigada y un conglomerado');
      return;
    }

    setLoading(true);
    setMensaje('');

    try {
      const response = await axios.post(
        `http://localhost:3003/api/brigadas/${brigadaSeleccionada}/asignar-conglomerado`,
        { id_conglomerado: parseInt(conglomeradoSeleccionado) }
      );

      if (response.data.success) {
        setMensaje('✅ Conglomerado asignado exitosamente');
        setBrigadaSeleccionada('');
        setConglomeradoSeleccionado('');
        cargarConglomeradosAprobados();
        cargarAsignaciones();
      }
    } catch (error) {
      setMensaje('❌ ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarAsignacion = async (brigadaId, conglomeradoId, nombreConglomerado) => {
    if (!window.confirm(`¿Eliminar asignación de "${nombreConglomerado}"?\n\nEl conglomerado volverá a estado "Aprobado" y podrá ser reasignado.`)) {
      return;
    }

    try {
      const response = await axios.delete(
        `http://localhost:3003/api/brigadas/${brigadaId}/asignar-conglomerado/${conglomeradoId}`
      );

      if (response.data.success) {
        setMensaje('✅ Asignación eliminada. El conglomerado volvió a estado "Aprobado"');
        cargarConglomeradosAprobados();
        cargarAsignaciones();
      }
    } catch (error) {
      setMensaje('❌ ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Asignar Brigada a Conglomerado
          </h1>
          <p className="text-gray-600">
            Asigna brigadas de campo a conglomerados aprobados para iniciar el trabajo de muestreo
          </p>
        </div>

        {/* Formulario de Asignación */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4">Nueva Asignación</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Seleccionar Brigada */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Users size={18} className="inline mr-2" />
                Seleccionar Brigada
              </label>
              <select
                value={brigadaSeleccionada}
                onChange={(e) => setBrigadaSeleccionada(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">-- Seleccione una brigada --</option>
                {brigadas.map((brigada) => (
                  <option key={brigada.id} value={brigada.id}>
                    {brigada.nombre} - {brigada.zona_designada}
                  </option>
                ))}
              </select>
            </div>

            {/* Seleccionar Conglomerado */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <MapPin size={18} className="inline mr-2" />
                Seleccionar Conglomerado Aprobado
              </label>
              <select
                value={conglomeradoSeleccionado}
                onChange={(e) => setConglomeradoSeleccionado(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">-- Seleccione un conglomerado --</option>
                {conglomerados.map((cong) => (
                  <option key={cong.id} value={cong.id}>
                    {cong.nombre} - {cong.municipio} ({cong.latitud}, {cong.longitud})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botón Asignar */}
          <button
            onClick={handleAsignar}
            disabled={loading || !brigadaSeleccionada || !conglomeradoSeleccionado}
            className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} />
                Asignando...
              </>
            ) : (
              <>
                <CheckCircle size={20} />
                Asignar Brigada
              </>
            )}
          </button>

          {/* Mensaje */}
          {mensaje && (
            <div className={`mt-4 p-3 rounded-lg text-sm ${
              mensaje.includes('✅') 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : mensaje.includes('⚠️')
                ? 'bg-yellow-50 border border-yellow-200 text-yellow-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {mensaje}
            </div>
          )}
        </div>

        {/* Lista de Asignaciones Recientes */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">Asignaciones Actuales</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Conglomerado</th>
                  <th className="text-left">Brigada</th>
                  <th className="text-left">Ubicación</th>
                  <th className="text-left">Estado</th>
                  <th className="text-left">Fecha Asignación</th>
                  <th className="text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {asignaciones.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      No hay asignaciones registradas
                    </td>
                  </tr>
                ) : (
                  asignaciones.map((asig, index) => (
                    <tr key={index}>
                      <td className="font-medium">{asig.nombre}</td>
                      <td>{asig.brigada_nombre}</td>
                      <td className="text-sm text-gray-600">
                        {asig.latitud}, {asig.longitud}
                      </td>
                      <td>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          asig.estado_asignacion === 'Completado' 
                            ? 'bg-green-100 text-green-800'
                            : asig.estado_asignacion === 'En_Proceso'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {asig.estado_asignacion}
                        </span>
                      </td>
                      <td className="text-sm text-gray-600">
                        {new Date(asig.fecha_asignacion).toLocaleDateString()}
                      </td>
                      <td>
                        <button
                          onClick={() => handleEliminarAsignacion(asig.brigada_id, asig.id, asig.nombre)}
                          className="text-red-500 hover:text-red-700 flex items-center gap-1"
                          title="Eliminar asignación"
                        >
                          <Trash2 size={16} />
                          <span className="text-sm">Quitar</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Información */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-bold text-blue-900 mb-2">ℹ️ Información</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Solo se pueden asignar conglomerados que estén en estado "Aprobado"</li>
            <li>• Al asignar, el conglomerado cambia automáticamente a estado "Asignado"</li>
            <li>• Al eliminar una asignación, el conglomerado vuelve a estado "Aprobado"</li>
            <li>• Las brigadas podrán ver sus conglomerados asignados en su panel</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}

export default AsignarBrigada;
