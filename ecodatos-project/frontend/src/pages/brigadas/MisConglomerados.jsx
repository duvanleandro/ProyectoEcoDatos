import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import Layout from '../../components/common/Layout';
import { MapPin, Calendar, CheckCircle } from 'lucide-react';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix para los iconos de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Iconos personalizados
const iconAsignado = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconEnProceso = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const iconCompletado = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MisConglomerados() {
  const [conglomerados, setConglomerados] = useState([]);
  const [brigadaInfo, setBrigadaInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Por ahora usamos brigada ID 1 como ejemplo
      // En producción, esto vendría del usuario logueado
      const brigadaId = 1;

      // Obtener info de la brigada
      const brigadaRes = await axios.get(`http://localhost:3003/api/brigadas/${brigadaId}`);
      if (brigadaRes.data.success) {
        setBrigadaInfo(brigadaRes.data.data);
      }

      // Obtener conglomerados asignados
      const congRes = await axios.get(`http://localhost:3003/api/brigadas/${brigadaId}/conglomerados`);
      if (congRes.data.success) {
        setConglomerados(congRes.data.data);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (estado) => {
    switch(estado) {
      case 'Completado':
        return iconCompletado;
      case 'En_Proceso':
        return iconEnProceso;
      default:
        return iconAsignado;
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Mis Conglomerados Asignados
          </h1>
          <p className="text-gray-600">
            Conglomerados asignados a tu brigada de campo
          </p>
        </div>

        {/* Info de la Brigada */}
        {brigadaInfo && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold mb-4">Información de la Brigada</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Brigada</p>
                <p className="text-lg font-bold text-primary">{brigadaInfo.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Zona Designada</p>
                <p className="text-lg font-semibold">{brigadaInfo.zona_designada}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Integrantes</p>
                <p className="text-lg font-semibold">{brigadaInfo.integrantes?.length || 0}</p>
              </div>
            </div>

            {/* Integrantes */}
            {brigadaInfo.integrantes && brigadaInfo.integrantes.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-semibold text-gray-700 mb-2">Miembros del equipo:</p>
                <div className="flex flex-wrap gap-2">
                  {brigadaInfo.integrantes.map((integrante) => (
                    <div
                      key={integrante.id}
                      className="bg-green-50 border border-green-200 px-3 py-1 rounded-full text-sm"
                    >
                      <strong>{integrante.nombre_apellidos}</strong>
                      <span className="text-gray-600 ml-2">({integrante.rol})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Total Asignados</p>
            <p className="text-2xl font-bold text-gray-800">{conglomerados.length}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Pendientes</p>
            <p className="text-2xl font-bold text-yellow-600">
              {conglomerados.filter(c => c.estado_asignacion === 'Pendiente').length}
            </p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">En Proceso</p>
            <p className="text-2xl font-bold text-blue-600">
              {conglomerados.filter(c => c.estado_asignacion === 'En_Proceso').length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Completados</p>
            <p className="text-2xl font-bold text-green-600">
              {conglomerados.filter(c => c.estado_asignacion === 'Completado').length}
            </p>
          </div>
        </div>

        {/* Mapa */}
        {conglomerados.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold">Ubicación de Conglomerados</h2>
            </div>
            <MapContainer
              center={[
                parseFloat(conglomerados[0].latitud),
                parseFloat(conglomerados[0].longitud)
              ]}
              zoom={6}
              style={{ height: '500px', width: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {conglomerados.map((cong) => (
                <Marker
                  key={cong.id}
                  position={[parseFloat(cong.latitud), parseFloat(cong.longitud)]}
                  icon={getIcon(cong.estado_asignacion)}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-bold text-primary mb-2">{cong.nombre}</h3>
                      <p className="text-sm mb-1">
                        <strong>ID:</strong> {cong.id}
                      </p>
                      <p className="text-sm mb-1">
                        <strong>Coordenadas:</strong><br />
                        {cong.latitud}, {cong.longitud}
                      </p>
                      <p className="text-sm mb-1">
                        <strong>Estado:</strong> <span className={`font-semibold ${
                          cong.estado_asignacion === 'Completado' ? 'text-green-600' :
                          cong.estado_asignacion === 'En_Proceso' ? 'text-blue-600' :
                          'text-yellow-600'
                        }`}>{cong.estado_asignacion}</span>
                      </p>
                      <p className="text-sm">
                        <strong>Fecha asignación:</strong><br />
                        {new Date(cong.fecha_asignacion).toLocaleDateString()}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        ) : (
          <div className="bg-white p-12 rounded-lg shadow text-center">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              No hay conglomerados asignados
            </h3>
            <p className="text-gray-600">
              Tu brigada aún no tiene conglomerados asignados para trabajo de campo
            </p>
          </div>
        )}

        {/* Lista de Conglomerados */}
        {conglomerados.length > 0 && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Lista de Conglomerados</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Conglomerado</th>
                    <th className="text-left">Ubicación</th>
                    <th className="text-left">Coordenadas</th>
                    <th className="text-left">Estado</th>
                    <th className="text-left">Fecha Asignación</th>
                  </tr>
                </thead>
                <tbody>
                  {conglomerados.map((cong) => (
                    <tr key={cong.id}>
                      <td className="font-medium">{cong.nombre}</td>
                      <td>
                        {cong.municipio}<br />
                        <span className="text-xs text-gray-500">{cong.departamento}</span>
                      </td>
                      <td className="text-sm text-gray-600">
                        {cong.latitud}, {cong.longitud}
                      </td>
                      <td>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          cong.estado_asignacion === 'Completado' 
                            ? 'bg-green-100 text-green-800'
                            : cong.estado_asignacion === 'En_Proceso'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {cong.estado_asignacion}
                        </span>
                      </td>
                      <td className="text-sm text-gray-600">
                        <Calendar size={14} className="inline mr-1" />
                        {new Date(cong.fecha_asignacion).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Leyenda */}
        {conglomerados.length > 0 && (
          <div className="mt-6 bg-white p-4 rounded-lg shadow">
            <h3 className="font-bold mb-2">Leyenda:</h3>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-400 rounded-full"></div>
                <span>Pendiente</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-orange-400 rounded-full"></div>
                <span>En Proceso</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span>Completado</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default MisConglomerados;
