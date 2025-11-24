import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { Save, X, MapPin, CloudRain, TreePine, Upload, Camera, CheckCircle } from 'lucide-react';
import axios from '../../config/axios';
import { API_CONFIG, ENDPOINTS } from '../../config/api';

function EditarObservacionAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  
  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [conglomerado, setConglomerado] = useState(null);
  const [subiendoFotos, setSubiendoFotos] = useState(false);
  
  const [formData, setFormData] = useState({
    id_conglomerado: '',
    id_subparcela: '',
    id_brigada: '',
    fecha_observacion: '',
    hora_inicio: '',
    hora_fin: '',
    temperatura: '',
    humedad: '',
    condiciones_clima: 'soleado',
    precipitacion: 'sin_lluvia',
    observaciones_generales: '',
    descripcion_vegetacion: '',
    fauna_observada: '',
    notas_coinvestigador: '',
    pendiente_grados: '',
    tipo_suelo: '',
    cobertura_vegetal: '',
    erosion: 'ninguna',
    presencia_agua: 'ninguna',
    latitud_verificada: '',
    longitud_verificada: '',
    altitud_msnm: '',
    precision_gps: 'alta',
    disturbios_humanos: '',
    evidencia_fauna: '',
    especies_invasoras: '',
    fotos: []
  });

  useEffect(() => {
    cargarObservacion();
  }, [id]);

  const cargarObservacion = async () => {
    setCargando(true);
    try {
      const response = await axios.get(`${API_CONFIG.OBSERVACION_SERVICE}${ENDPOINTS.OBSERVACION.BASE}/${id}`);
      
      if (response.data.success) {
        const obs = response.data.data;
        setFormData({
          id_conglomerado: obs.id_conglomerado,
          id_subparcela: obs.id_subparcela || '',
          id_brigada: obs.id_brigada,
          fecha_observacion: obs.fecha_observacion?.split('T')[0] || '',
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
          especies_invasoras: obs.especies_invasoras || '',
          fotos: obs.fotos || []
        });

        // Cargar info del conglomerado
        if (obs.id_conglomerado) {
          const responseCong = await axios.get(`${API_CONFIG.CONGLOMERADO_SERVICE}${ENDPOINTS.CONGLOMERADO.BASE}/${obs.id_conglomerado}`);
          if (responseCong.data.success) {
            setConglomerado(responseCong.data.data);
          }
        }
      }
    } catch (error) {
      setMensaje('❌ Error al cargar observación: ' + error.message);
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
      const datosLimpios = {
        ...formData,
        hora_inicio: formData.hora_inicio === '' ? null : formData.hora_inicio,
        hora_fin: formData.hora_fin === '' ? null : formData.hora_fin,
        temperatura: formData.temperatura === '' ? null : formData.temperatura,
        humedad: formData.humedad === '' ? null : formData.humedad,
        pendiente_grados: formData.pendiente_grados === '' ? null : formData.pendiente_grados,
        latitud_verificada: formData.latitud_verificada === '' ? null : formData.latitud_verificada,
        longitud_verificada: formData.longitud_verificada === '' ? null : formData.longitud_verificada,
        altitud_msnm: formData.altitud_msnm === '' ? null : formData.altitud_msnm,
        id_subparcela: formData.id_subparcela === '' ? null : formData.id_subparcela
      };

      const response = await axios.put(
        `${API_CONFIG.OBSERVACION_SERVICE}${ENDPOINTS.OBSERVACION.BASE}/${id}`,
        datosLimpios
      );
      
      if (response.data.success) {
        setMensaje('✅ Observación actualizada exitosamente');
        setTimeout(() => {
          navigate('/observaciones');
        }, 2000);
      }
    } catch (error) {
      setMensaje('❌ Error al actualizar: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSubirFotos = async (e) => {
    const archivos = Array.from(e.target.files);
    if (archivos.length === 0) return;

    setSubiendoFotos(true);
    const formDataFotos = new FormData();
    
    archivos.forEach(archivo => {
      formDataFotos.append('fotos', archivo);
    });

    try {
      const response = await axios.post(
        `${API_CONFIG.OBSERVACION_SERVICE}${ENDPOINTS.OBSERVACION.BASE}/${id}/fotos`,
        formDataFotos,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.data.success) {
        setMensaje(`✅ ${archivos.length} foto(s) subida(s) exitosamente`);
        setFormData(prev => ({ ...prev, fotos: response.data.data.fotos || [] }));
        setTimeout(() => setMensaje(''), 3000);
        cargarObservacion();
      }
    } catch (error) {
      setMensaje('❌ Error al subir fotos: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubiendoFotos(false);
      e.target.value = '';
    }
  };

  const handleEliminarFoto = async (nombreFoto) => {
    if (!window.confirm('¿Eliminar esta foto?')) return;

    try {
      const response = await axios.delete(
        `${API_CONFIG.OBSERVACION_SERVICE}${ENDPOINTS.OBSERVACION.BASE}/${id}/fotos/${nombreFoto}`
      );

      if (response.data.success) {
        setMensaje('✅ Foto eliminada');
        setFormData(prev => ({ ...prev, fotos: response.data.data.fotos || [] }));
        setTimeout(() => setMensaje(''), 3000);
      }
    } catch (error) {
      setMensaje('❌ Error al eliminar foto');
    }
  };

  const handleValidarFinal = async () => {
    if (!window.confirm('¿Realizar validación final? Esta acción bloqueará la observación permanentemente.')) return;
    
    setLoading(true);
    try {
      const response = await axios.put(
        `${API_CONFIG.OBSERVACION_SERVICE}${ENDPOINTS.OBSERVACION.BASE}/${id}/validar-admin`,
        { idUsuario: usuario.id }
      );
      
      if (response.data.success) {
        setMensaje('✅ Observación validada exitosamente');
        setTimeout(() => {
          navigate('/observaciones');
        }, 2000);
      }
    } catch (error) {
      setMensaje('❌ Error: ' + (error.response?.data?.message || error.message));
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

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Editar Observación (Admin)</h1>
                {conglomerado && (
                  <p className="text-sm text-gray-600">
                    <strong>Conglomerado:</strong> {conglomerado.nombre}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => navigate('/observaciones')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
              Cancelar
            </button>
          </div>

          {mensaje && (
            <div className={`mb-4 p-4 rounded-lg ${
              mensaje.includes('✅') ? 'bg-green-50 text-green-800' : 
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hora Inicio</label>
                  <input
                    type="time"
                    name="hora_inicio"
                    value={formData.hora_inicio}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hora Fin</label>
                  <input
                    type="time"
                    name="hora_fin"
                    value={formData.hora_fin}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Sección: Condiciones Climáticas */}
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <CloudRain className="w-5 h-5" />
                Condiciones Climáticas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Temperatura (°C) *</label>
                  <input
                    type="number"
                    step="0.1"
                    name="temperatura"
                    value={formData.temperatura}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Humedad (%) *</label>
                  <input
                    type="number"
                    name="humedad"
                    value={formData.humedad}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Condiciones del Clima *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precipitación *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones Generales *</label>
                  <textarea
                    name="observaciones_generales"
                    value={formData.observaciones_generales}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descripción de la Vegetación *</label>
                  <textarea
                    name="descripcion_vegetacion"
                    value={formData.descripcion_vegetacion}
                    onChange={handleChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Sección: Fotos */}
            <div className="border-b pb-4">
              <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Fotografías
              </h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agregar fotos (máx. 5MB cada una)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleSubirFotos}
                  disabled={subiendoFotos}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
                {subiendoFotos && (
                  <p className="text-sm text-blue-600 mt-1">Subiendo fotos...</p>
                )}
              </div>

              {formData.fotos && formData.fotos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.fotos.map((foto, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={`${API_CONFIG.OBSERVACION_SERVICE}/uploads/observaciones/${id}/${foto}`}
                        alt={`Foto ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => handleEliminarFoto(foto)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {(!formData.fotos || formData.fotos.length === 0) && (
                <p className="text-sm text-gray-500 italic">No se han subido fotos aún</p>
              )}
            </div>

            {/* Botones */}
            <div className="flex justify-between items-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/observaciones')}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  <Save className="w-5 h-5" />
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                
                <button
                  type="button"
                  onClick={handleValidarFinal}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                >
                  <CheckCircle className="w-5 h-5" />
                  {loading ? 'Validando...' : 'Validación Final'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default EditarObservacionAdmin;
