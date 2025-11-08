import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { FileText, ArrowLeft, MapPin, CloudRain, TreePine, Mountain, CheckCircle } from 'lucide-react';
import axios from 'axios';

function DetalleObservacion() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [observacion, setObservacion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarObservacion();
  }, [id]);

  const cargarObservacion = async () => {
    try {
      const response = await axios.get(`http://localhost:3005/api/observaciones/${id}`);
      if (response.data.success) {
        setObservacion(response.data.data);
      }
    } catch (error) {
      console.error('Error al cargar observación:', error);
      alert('❌ Error al cargar observación');
      navigate('/observaciones/lista');
    } finally {
      setLoading(false);
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
        <div className="text-center py-8">Observación no encontrada</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  Observación #{observacion.id}
                </h1>
                <p className="text-sm text-gray-600">
                  Conglomerado #{observacion.id_conglomerado}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {observacion.validado ? (
                <span className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg">
                  <CheckCircle className="w-5 h-5" />
                  Validada
                </span>
              ) : (
                <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
                  Pendiente
                </span>
              )}
              <button
                onClick={() => navigate('/observaciones/lista')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                Volver
              </button>
            </div>
          </div>

          {/* Información Básica */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Información Básica
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Fecha:</span>
                <p className="text-gray-800">
                  {new Date(observacion.fecha_observacion).toLocaleDateString()}
                </p>
              </div>
              {observacion.hora_inicio && (
                <div>
                  <span className="font-medium text-gray-600">Hora Inicio:</span>
                  <p className="text-gray-800">{observacion.hora_inicio}</p>
                </div>
              )}
              {observacion.hora_fin && (
                <div>
                  <span className="font-medium text-gray-600">Hora Fin:</span>
                  <p className="text-gray-800">{observacion.hora_fin}</p>
                </div>
              )}
            </div>
          </div>

          {/* Condiciones Climáticas */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <CloudRain className="w-5 h-5" />
              Condiciones Climáticas
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Temperatura:</span>
                <p className="text-gray-800">
                  {observacion.temperatura ? `${observacion.temperatura}°C` : 'No registrada'}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Humedad:</span>
                <p className="text-gray-800">
                  {observacion.humedad ? `${observacion.humedad}%` : 'No registrada'}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Clima:</span>
                <p className="text-gray-800 capitalize">
                  {observacion.condiciones_clima?.replace('_', ' ') || 'No registrado'}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Precipitación:</span>
                <p className="text-gray-800 capitalize">
                  {observacion.precipitacion?.replace('_', ' ') || 'No registrada'}
                </p>
              </div>
            </div>
          </div>

          {/* Observaciones de Campo */}
          <div className="mb-6 p-4 bg-green-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <TreePine className="w-5 h-5" />
              Observaciones de Campo
            </h2>
            <div className="space-y-3 text-sm">
              {observacion.observaciones_generales && (
                <div>
                  <span className="font-medium text-gray-600">Observaciones Generales:</span>
                  <p className="text-gray-800 mt-1">{observacion.observaciones_generales}</p>
                </div>
              )}
              {observacion.descripcion_vegetacion && (
                <div>
                  <span className="font-medium text-gray-600">Descripción de la Vegetación:</span>
                  <p className="text-gray-800 mt-1">{observacion.descripcion_vegetacion}</p>
                </div>
              )}
              {observacion.fauna_observada && (
                <div>
                  <span className="font-medium text-gray-600">Fauna Observada:</span>
                  <p className="text-gray-800 mt-1">{observacion.fauna_observada}</p>
                </div>
              )}
              {observacion.notas_coinvestigador && (
                <div>
                  <span className="font-medium text-gray-600">Notas del Coinvestigador:</span>
                  <p className="text-gray-800 mt-1">{observacion.notas_coinvestigador}</p>
                </div>
              )}
            </div>
          </div>

          {/* Condiciones del Terreno */}
          {(observacion.pendiente_grados || observacion.tipo_suelo || observacion.erosion || observacion.presencia_agua) && (
            <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Mountain className="w-5 h-5" />
                Condiciones del Terreno
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                {observacion.pendiente_grados && (
                  <div>
                    <span className="font-medium text-gray-600">Pendiente:</span>
                    <p className="text-gray-800">{observacion.pendiente_grados}°</p>
                  </div>
                )}
                {observacion.tipo_suelo && (
                  <div>
                    <span className="font-medium text-gray-600">Tipo de Suelo:</span>
                    <p className="text-gray-800">{observacion.tipo_suelo}</p>
                  </div>
                )}
                {observacion.cobertura_vegetal && (
                  <div>
                    <span className="font-medium text-gray-600">Cobertura Vegetal:</span>
                    <p className="text-gray-800">{observacion.cobertura_vegetal}</p>
                  </div>
                )}
                {observacion.erosion && (
                  <div>
                    <span className="font-medium text-gray-600">Erosión:</span>
                    <p className="text-gray-800 capitalize">{observacion.erosion}</p>
                  </div>
                )}
                {observacion.presencia_agua && (
                  <div>
                    <span className="font-medium text-gray-600">Presencia de Agua:</span>
                    <p className="text-gray-800 capitalize">{observacion.presencia_agua?.replace('_', ' ')}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Coordenadas GPS */}
          {(observacion.latitud_verificada || observacion.longitud_verificada) && (
            <div className="mb-6 p-4 bg-purple-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Coordenadas GPS Verificadas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                {observacion.latitud_verificada && (
                  <div>
                    <span className="font-medium text-gray-600">Latitud:</span>
                    <p className="text-gray-800">{observacion.latitud_verificada}</p>
                  </div>
                )}
                {observacion.longitud_verificada && (
                  <div>
                    <span className="font-medium text-gray-600">Longitud:</span>
                    <p className="text-gray-800">{observacion.longitud_verificada}</p>
                  </div>
                )}
                {observacion.altitud_msnm && (
                  <div>
                    <span className="font-medium text-gray-600">Altitud:</span>
                    <p className="text-gray-800">{observacion.altitud_msnm} msnm</p>
                  </div>
                )}
                {observacion.precision_gps && (
                  <div>
                    <span className="font-medium text-gray-600">Precisión GPS:</span>
                    <p className="text-gray-800 capitalize">{observacion.precision_gps}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Observaciones Especiales */}
          {(observacion.disturbios_humanos || observacion.evidencia_fauna || observacion.especies_invasoras) && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Observaciones Especiales
              </h2>
              <div className="space-y-3 text-sm">
                {observacion.disturbios_humanos && (
                  <div>
                    <span className="font-medium text-gray-600">Disturbios Humanos:</span>
                    <p className="text-gray-800 mt-1">{observacion.disturbios_humanos}</p>
                  </div>
                )}
                {observacion.evidencia_fauna && (
                  <div>
                    <span className="font-medium text-gray-600">Evidencia de Fauna:</span>
                    <p className="text-gray-800 mt-1">{observacion.evidencia_fauna}</p>
                  </div>
                )}
                {observacion.especies_invasoras && (
                  <div>
                    <span className="font-medium text-gray-600">Especies Invasoras:</span>
                    <p className="text-gray-800 mt-1">{observacion.especies_invasoras}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadatos */}
          <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <span className="font-medium">Registrado por:</span> Usuario #{observacion.registrado_por}
              </div>
              <div>
                <span className="font-medium">Fecha de registro:</span>{' '}
                {new Date(observacion.created_at).toLocaleString()}
              </div>
              {observacion.validado && (
                <>
                  <div>
                    <span className="font-medium">Validado por:</span> Usuario #{observacion.validado_por}
                  </div>
                  <div>
                    <span className="font-medium">Fecha de validación:</span>{' '}
                    {new Date(observacion.fecha_validacion).toLocaleString()}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default DetalleObservacion;
