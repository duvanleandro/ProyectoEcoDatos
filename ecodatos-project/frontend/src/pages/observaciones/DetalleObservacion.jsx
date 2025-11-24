import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { ArrowLeft, MapPin, CloudRain, TreePine, Camera, CheckCircle, Clock, User } from 'lucide-react';
import axios from '../../config/axios';
import { API_CONFIG, ENDPOINTS } from '../../config/api';

function DetalleObservacion() {
  const { id } = useParams();
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  
  const [observacion, setObservacion] = useState(null);
  const [conglomerado, setConglomerado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [imagenAmpliada, setImagenAmpliada] = useState(null);

  useEffect(() => {
    cargarObservacion();
  }, [id]);

  const cargarObservacion = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_CONFIG.OBSERVACION_SERVICE}${ENDPOINTS.OBSERVACION.BASE}/${id}`);
      
      if (response.data.success) {
        const obs = response.data.data;
        setObservacion(obs);
        
        // Cargar datos del conglomerado
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
      setLoading(false);
    }
  };

  const handleValidarAdmin = async () => {
    if (!window.confirm('¿Realizar validación final? Esta acción bloqueará la observación permanentemente.')) return;
    
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
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="text-center py-8">Cargando...</div>
      </Layout>
    );
  }

  if (!observacion) {
    return (
      <Layout>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Observación no encontrada</p>
          <button
            onClick={() => navigate('/observaciones')}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg"
          >
            Volver
          </button>
        </div>
      </Layout>
    );
  }

  const esAdmin = usuario.tipo_usuario === 'admin' || usuario.tipo_usuario === 'coordinador';
  const puedeValidarAdmin = esAdmin && observacion.validado_por_jefe && !observacion.validado;

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6 border-b pb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/observaciones')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Detalle de Observación</h1>
                {conglomerado && (
                  <p className="text-sm text-gray-600">
                    <strong>Conglomerado:</strong> {conglomerado.nombre}
                  </p>
                )}
              </div>
            </div>
            
            {/* Estados de validación */}
            <div className="flex gap-2">
              {observacion.validado_por_jefe && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Enviado por Jefe
                </span>
              )}
              {observacion.validado && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Validado
                </span>
              )}
            </div>
          </div>

          {mensaje && (
            <div className={`mb-4 p-4 rounded-lg ${
              mensaje.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {mensaje}
            </div>
          )}

          {/* Información Básica */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Información Básica
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Fecha</p>
                <p className="font-medium">{new Date(observacion.fecha_observacion).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Hora Inicio</p>
                <p className="font-medium">{observacion.hora_inicio || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Hora Fin</p>
                <p className="font-medium">{observacion.hora_fin || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Condiciones Climáticas */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <CloudRain className="w-5 h-5" />
              Condiciones Climáticas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Temperatura</p>
                <p className="font-medium">{observacion.temperatura}°C</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Humedad</p>
                <p className="font-medium">{observacion.humedad}%</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Condiciones</p>
                <p className="font-medium capitalize">{observacion.condiciones_clima?.replace('_', ' ')}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Precipitación</p>
                <p className="font-medium capitalize">{observacion.precipitacion?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>

          {/* Observaciones de Campo */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <TreePine className="w-5 h-5" />
              Observaciones de Campo
            </h2>
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Observaciones Generales</p>
                <p className="text-gray-800">{observacion.observaciones_generales || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Descripción de Vegetación</p>
                <p className="text-gray-800">{observacion.descripcion_vegetacion || 'N/A'}</p>
              </div>
              {observacion.fauna_observada && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Fauna Observada</p>
                  <p className="text-gray-800">{observacion.fauna_observada}</p>
                </div>
              )}
              {observacion.notas_coinvestigador && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Notas del Coinvestigador</p>
                  <p className="text-gray-800">{observacion.notas_coinvestigador}</p>
                </div>
              )}
            </div>
          </div>

          {/* Fotografías */}
          {observacion.fotos && observacion.fotos.length > 0 && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Fotografías ({observacion.fotos.length})
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {observacion.fotos.map((foto, index) => (
                  <div 
                    key={index} 
                    className="relative group cursor-pointer"
                    onClick={() => setImagenAmpliada(`${API_CONFIG.OBSERVACION_SERVICE}/uploads/observaciones/${observacion.id}/${foto}`)}
                  >
                    <img
                      src={`${API_CONFIG.OBSERVACION_SERVICE}/uploads/observaciones/${observacion.id}/${foto}`}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-40 object-cover rounded-lg border hover:opacity-80 transition-opacity"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                      <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botón de validación para Admin */}
          {puedeValidarAdmin && (
            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={handleValidarAdmin}
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <CheckCircle className="w-5 h-5" />
                Validación Final (Bloquear)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal de imagen ampliada */}
      {imagenAmpliada && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setImagenAmpliada(null)}
        >
          <img
            src={imagenAmpliada}
            alt="Imagen ampliada"
            className="max-w-full max-h-full object-contain"
          />
          <button
            onClick={() => setImagenAmpliada(null)}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-75"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>
      )}
    </Layout>
  );
}

export default DetalleObservacion;
