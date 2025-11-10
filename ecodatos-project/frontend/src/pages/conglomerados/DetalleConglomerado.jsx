import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Layout from '../../components/common/Layout';
import { MapPin, Calendar, Users, FileText, ArrowLeft, Leaf, Eye } from 'lucide-react';
import axios from '../../config/axios';
import { API_CONFIG, ENDPOINTS } from '../../config/api';

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function DetalleConglomerado() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [conglomerado, setConglomerado] = useState(null);
  const [subparcelas, setSubparcelas] = useState([]);
  const [observaciones, setObservaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, [id]);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      // Cargar datos del conglomerado
      const responseCong = await axios.get(`${API_CONFIG.CONGLOMERADO_SERVICE}${ENDPOINTS.CONGLOMERADO.BASE}/${id}`);
      if (responseCong.data.success) {
        setConglomerado(responseCong.data.data);
        if (responseCong.data.data.subparcelas) {
          setSubparcelas(responseCong.data.data.subparcelas);
        }
      }

      // Cargar observaciones del conglomerado
      try {
        const responseObs = await axios.get(`${API_CONFIG.OBSERVACION_SERVICE}${ENDPOINTS.OBSERVACION.CONGLOMERADO(id)}`);
        if (responseObs.data.success) {
          setObservaciones(responseObs.data.data || []);
        }
      } catch (error) {
        console.log('No hay observaciones para este conglomerado');
        setObservaciones([]);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEstadoColor = (estado) => {
    switch(estado) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Aprobado':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Rechazado':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'Asignado':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'En_Proceso':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'Completado':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando detalles...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!conglomerado) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-semibold">Conglomerado no encontrado</p>
            <p className="text-sm mt-1">El conglomerado que buscas no existe o fue eliminado.</p>
            <button
              onClick={() => navigate('/conglomerados/lista')}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
            >
              Volver a la lista
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const latitud = parseFloat(conglomerado.latitud);
  const longitud = parseFloat(conglomerado.longitud);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => navigate('/conglomerados/lista')}
                className="text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={24} />
              </button>
              <h1 className="text-3xl font-bold text-gray-800">
                {conglomerado.nombre}
              </h1>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${getEstadoColor(conglomerado.estado)}`}>
                {conglomerado.estado === 'En_Proceso' ? 'En Proceso' : conglomerado.estado}
              </span>
            </div>
            <p className="text-gray-600">
              Detalles completos del conglomerado
            </p>
          </div>
        </div>

        {/* Información General */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Datos Básicos */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FileText size={20} className="text-primary" />
              Información General
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">ID</p>
                <p className="font-semibold">{conglomerado.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nombre</p>
                <p className="font-semibold">{conglomerado.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Ubicación</p>
                <p className="font-semibold flex items-center gap-2">
                  <MapPin size={16} className="text-primary" />
                  {conglomerado.municipio}, {conglomerado.departamento}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Coordenadas</p>
                <p className="font-semibold text-sm">
                  Latitud: {latitud.toFixed(6)}° / Longitud: {longitud.toFixed(6)}°
                </p>
              </div>
              {conglomerado.brigada_nombre && (
                <div>
                  <p className="text-sm text-gray-600">Brigada Asignada</p>
                  <p className="font-semibold flex items-center gap-2">
                    <Users size={16} className="text-primary" />
                    {conglomerado.brigada_nombre}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Fechas */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              Fechas Importantes
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Fecha de Creación</p>
                <p className="font-semibold">{formatearFecha(conglomerado.fecha_creacion)}</p>
              </div>
              {conglomerado.fecha_aprobacion && (
                <div>
                  <p className="text-sm text-gray-600">Fecha de Aprobación</p>
                  <p className="font-semibold">{formatearFecha(conglomerado.fecha_aprobacion)}</p>
                </div>
              )}
              {conglomerado.fecha_asignacion && (
                <div>
                  <p className="text-sm text-gray-600">Fecha de Asignación</p>
                  <p className="font-semibold">{formatearFecha(conglomerado.fecha_asignacion)}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mapa */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-primary" />
            Ubicación en el Mapa
          </h2>
          <div className="h-96 rounded-lg overflow-hidden">
            <MapContainer
              center={[latitud, longitud]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[latitud, longitud]}>
                <Popup>
                  <div className="text-center">
                    <p className="font-bold">{conglomerado.nombre}</p>
                    <p className="text-sm">{conglomerado.municipio}</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>

        {/* Subparcelas */}
        {subparcelas.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Leaf size={20} className="text-primary" />
              Subparcelas ({subparcelas.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subparcelas.map((subparcela) => (
                <div key={subparcela.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <h3 className="font-bold text-lg mb-2">{subparcela.nombre}</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Número:</strong> {subparcela.numero}
                  </p>
                  {subparcela.latitud && subparcela.longitud && (
                    <p className="text-sm text-gray-600 mt-1">
                      <strong>Coordenadas:</strong><br />
                      {parseFloat(subparcela.latitud).toFixed(6)}°,{' '}
                      {parseFloat(subparcela.longitud).toFixed(6)}°
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Observaciones */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Eye size={20} className="text-primary" />
            Observaciones de Campo ({observaciones.length})
          </h2>
          {observaciones.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No hay observaciones registradas para este conglomerado aún.
            </p>
          ) : (
            <div className="space-y-4">
              {observaciones.map((obs) => (
                <div key={obs.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">Observación #{obs.id}</p>
                      <p className="text-sm text-gray-600 mt-1">
                        <strong>Fecha:</strong> {formatearFecha(obs.fecha_observacion)}
                      </p>
                      {obs.hora_inicio && (
                        <p className="text-sm text-gray-600">
                          <strong>Hora:</strong> {obs.hora_inicio} {obs.hora_fin && `- ${obs.hora_fin}`}
                        </p>
                      )}
                      {obs.temperatura && (
                        <p className="text-sm text-gray-600">
                          <strong>Temperatura:</strong> {obs.temperatura}°C
                        </p>
                      )}
                      {obs.observaciones_generales && (
                        <p className="text-sm text-gray-700 mt-2">
                          {obs.observaciones_generales}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => navigate(`/observaciones/detalle/${obs.id}`)}
                      className="ml-4 text-blue-500 hover:text-blue-700 flex items-center gap-1 text-sm"
                    >
                      <Eye size={16} />
                      Ver detalle
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default DetalleConglomerado;
