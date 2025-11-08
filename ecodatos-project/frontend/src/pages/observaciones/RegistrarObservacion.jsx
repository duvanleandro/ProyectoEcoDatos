import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { FileText, Save, X, MapPin, CloudRain, TreePine, Upload } from 'lucide-react';
import axios from 'axios';

function RegistrarObservacion() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  
  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [conglomerado, setConglomerado] = useState(null);
  const [observacionExistente, setObservacionExistente] = useState(null);

  const [formData, setFormData] = useState({
    id_conglomerado: '',
    id_subparcela: '',
    id_brigada: '',
    fecha_observacion: new Date().toISOString().split('T')[0],
    hora_inicio: '',
    hora_fin: '',
    
    // Clima
    temperatura: '',
    humedad: '',
    condiciones_clima: 'soleado',
    precipitacion: 'sin_lluvia',
    
    // Observaciones
    observaciones_generales: '',
    descripcion_vegetacion: '',
    fauna_observada: '',
    notas_coinvestigador: '',
    
    // Terreno
    pendiente_grados: '',
    tipo_suelo: '',
    cobertura_vegetal: '',
    erosion: 'ninguna',
    presencia_agua: 'ninguna',
    
    // GPS
    latitud_verificada: '',
    longitud_verificada: '',
    altitud_msnm: '',
    precision_gps: 'alta',
    
    // Observaciones especiales
    disturbios_humanos: '',
    evidencia_fauna: '',
    especies_invasoras: '',
    
    registrado_por: usuario.id || 1
  });

  useEffect(() => {
    cargarConglomeradoEnProceso();
  }, []);

  const cargarConglomeradoEnProceso = async () => {
    setCargando(true);
    try {
      // Obtener conglomerados de la brigada del usuario
      const responseBrigada = await axios.get(`http://localhost:3003/api/brigadas/usuario/${usuario.id}`);
      
      if (!responseBrigada.data.success || !responseBrigada.data.data) {
        setMensaje('❌ No perteneces a ninguna brigada');
        setCargando(false);
        return;
      }

      const idBrigada = responseBrigada.data.data.id;

      // Buscar conglomerado EN PROCESO de esta brigada
      const responseConglomerados = await axios.get(`http://localhost:3002/api/conglomerados`);
      const conglomerados = responseConglomerados.data.data;
      
      const conglomeradoEnProceso = conglomerados.find(
        c => c.brigada_id === idBrigada && c.estado === 'En_Proceso'
      );

      if (!conglomeradoEnProceso) {
        setMensaje('⚠️ No tienes ningún conglomerado en proceso. Inicia uno desde "Mis Conglomerados Asignados".');
        setCargando(false);
        return;
      }

      setConglomerado(conglomeradoEnProceso);

      // Buscar si ya existe una observación para este conglomerado
      const responseObs = await axios.get(
        `http://localhost:3005/api/observaciones/conglomerado/${conglomeradoEnProceso.id}`
      );

      if (responseObs.data.success && responseObs.data.data.length > 0) {
        const obs = responseObs.data.data[0];
        setObservacionExistente(obs);
        
        // Precargar datos de la observación existente
        setFormData({
          ...formData,
          id_conglomerado: obs.id_conglomerado,
          id_brigada: obs.id_brigada,
          fecha_observacion: obs.fecha_observacion?.split('T')[0] || formData.fecha_observacion,
          hora_inicio: obs.hora_inicio || '',
          hora_fin: obs.hora_fin || '',
          temperatura: obs.temperatura || '',
          humedad: obs.humedad || '',
          condiciones_clima: obs.condiciones_clima || 'soleado',
          precipitacion: obs.precipitacion || 'sin_lluvia',
          observaciones_generales: obs.observaciones_generales || '',
          descripcion_vegetacion: obs.descripcion_vegetacion || '',
          fauna_observada: obs.fauna_observada || '',
          notas_coinvestigador: obs.notas_coinvestigador || '',
          pendiente_grados: obs.pendiente_grados || '',
          tipo_suelo: obs.tipo_suelo || '',
          cobertura_vegetal: obs.cobertura_vegetal || '',
          erosion: obs.erosion || 'ninguna',
          presencia_agua: obs.presencia_agua || 'ninguna',
          latitud_verificada: obs.latitud_verificada || '',
          longitud_verificada: obs.longitud_verificada || '',
          altitud_msnm: obs.altitud_msnm || '',
          precision_gps: obs.precision_gps || 'alta',
          disturbios_humanos: obs.disturbios_humanos || '',
          evidencia_fauna: obs.evidencia_fauna || '',
          especies_invasoras: obs.especies_invasoras || ''
        });
      } else {
        // No hay observación, usar valores por defecto con el conglomerado
        setFormData(prev => ({
          ...prev,
          id_conglomerado: conglomeradoEnProceso.id,
          id_brigada: idBrigada
        }));
      }

    } catch (error) {
      console.error('Error al cargar conglomerado:', error);
      setMensaje('❌ Error al cargar información del conglomerado');
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    try {
      let response;
      
      if (observacionExistente) {
        // Actualizar observación existente
        response = await axios.put(
          `http://localhost:3005/api/observaciones/${observacionExistente.id}`,
          formData
        );
      } else {
        // Crear nueva observación
        response = await axios.post('http://localhost:3005/api/observaciones', formData);
      }
      
      if (response.data.success) {
        setMensaje(`✅ Observación ${observacionExistente ? 'actualizada' : 'registrada'} exitosamente`);
        setTimeout(() => {
          navigate('/brigadas/mis-conglomerados');
        }, 2000);
      }
    } catch (error) {
      setMensaje('❌ Error al guardar observación: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (cargando) {
    return (
      <Layout>
        <div className="text-center py-8">Cargando...</div>
      </Layout>
    );
  }

  if (!conglomerado) {
    return (
      <Layout>
        <div className="max-w-5xl mx-auto">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-yellow-800 mb-2">⚠️ No hay conglomerado en proceso</h2>
            <p className="text-yellow-700 mb-4">
              {mensaje || 'Debes iniciar un conglomerado antes de registrar observaciones.'}
            </p>
            <button
              onClick={() => navigate('/brigadas/mis-conglomerados')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              Ir a Mis Conglomerados
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {observacionExistente ? 'Editar' : 'Registrar'} Observación de Campo
                </h1>
                <p className="text-sm text-gray-600">
                  <strong>Conglomerado:</strong> {conglomerado.nombre}
                </p>
                <p className="text-xs text-gray-500">
                  ID: {conglomerado.id} | Ubicación: {conglomerado.ubicacion}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/brigadas/mis-conglomerados')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
              Cancelar
            </button>
          </div>

          {mensaje && (
            <div className={`mb-4 p-4 rounded-lg ${
              mensaje.includes('✅') ? 'bg-green-50 text-green-800' : 
              mensaje.includes('⚠️') ? 'bg-yellow-50 text-yellow-800' :
              'bg-red-50 text-red-800'
            }`}>
              {mensaje}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sección: Datos Básicos */}
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Datos Básicos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha
                  </label>
                  <input
                    type="date"
                    name="fecha_observacion"
                    value={formData.fecha_observacion}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora Inicio (automática)
                  </label>
                  <input
                    type="time"
                    name="hora_inicio"
                    value={formData.hora_inicio}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    readOnly
                    title="Se registró automáticamente al iniciar el conglomerado"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hora Fin (automática)
                  </label>
                  <input
                    type="time"
                    name="hora_fin"
                    value={formData.hora_fin}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100"
                    readOnly
                    title="Se registrará automáticamente al completar el conglomerado"
                  />
                </div>
              </div>
            </div>

            {/* Resto del formulario continúa igual... */}
            {/* Sección: Condiciones Climáticas */}
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <CloudRain className="w-5 h-5" />
                Condiciones Climáticas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Temperatura (°C) *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    name="temperatura"
                    value={formData.temperatura}
                    onChange={handleChange}
                    placeholder="Ej: 28.5"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Humedad (%) *
                  </label>
                  <input
                    type="number"
                    name="humedad"
                    value={formData.humedad}
                    onChange={handleChange}
                    placeholder="Ej: 75"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condiciones del Clima *
                  </label>
                  <select
                    name="condiciones_clima"
                    value={formData.condiciones_clima}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="soleado">Soleado</option>
                    <option value="parcialmente_nublado">Parcialmente Nublado</option>
                    <option value="nublado">Nublado</option>
                    <option value="lluvioso">Lluvioso</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Precipitación *
                  </label>
                  <select
                    name="precipitacion"
                    value={formData.precipitacion}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="sin_lluvia">Sin Lluvia</option>
                    <option value="llovizna">Llovizna</option>
                    <option value="lluvia_moderada">Lluvia Moderada</option>
                    <option value="lluvia_fuerte">Lluvia Fuerte</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sección: Observaciones Generales */}
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <TreePine className="w-5 h-5" />
                Observaciones de Campo
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observaciones Generales *
                  </label>
                  <textarea
                    name="observaciones_generales"
                    value={formData.observaciones_generales}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Descripción general del sitio, condiciones observadas..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción de la Vegetación *
                  </label>
                  <textarea
                    name="descripcion_vegetacion"
                    value={formData.descripcion_vegetacion}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Tipos de vegetación, altura del dosel, especies dominantes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fauna Observada
                  </label>
                  <textarea
                    name="fauna_observada"
                    value={formData.fauna_observada}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Aves, mamíferos, reptiles observados..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notas del Coinvestigador Local
                  </label>
                  <textarea
                    name="notas_coinvestigador"
                    value={formData.notas_coinvestigador}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Información proporcionada por la comunidad local..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/brigadas/mis-conglomerados')}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
              >
                <Save className="w-5 h-5" />
                {loading ? 'Guardando...' : (observacionExistente ? 'Actualizar' : 'Guardar') + ' Observación'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default RegistrarObservacion;
