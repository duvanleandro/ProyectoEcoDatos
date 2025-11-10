import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar } from 'lucide-react';
import axios from '../../config/axios';
import { API_CONFIG, ENDPOINTS } from '../../config/api';

function ConglomeradoActivoCard({ usuario }) {
  const navigate = useNavigate();
  const [conglomeradoActivo, setConglomeradoActivo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarConglomeradoActivo();
  }, []);

  const cargarConglomeradoActivo = async () => {
    try {
      setLoading(true);

      // Primero obtener la brigada del usuario
      console.log('🔍 Buscando brigada para usuario:', usuario.id);
      const respBrigada = await axios.get(
        `${API_CONFIG.BRIGADA_SERVICE}${ENDPOINTS.BRIGADA.USUARIO(usuario.id)}`
      );

      console.log('📋 Respuesta brigada:', respBrigada.data);

      if (respBrigada.data.success && respBrigada.data.data?.id) {
        const brigadaId = respBrigada.data.data.id;
        console.log('✅ Brigada encontrada, ID:', brigadaId);

        // Obtener conglomerado activo de la brigada
        const respCong = await axios.get(
          `${API_CONFIG.CONGLOMERADO_SERVICE}${ENDPOINTS.CONGLOMERADO.BRIGADA_ACTIVO(brigadaId)}`
        );

        console.log('🌳 Respuesta conglomerado:', respCong.data);

        if (respCong.data.success && respCong.data.data) {
          console.log('✅ Conglomerado activo encontrado:', respCong.data.data);
          setConglomeradoActivo(respCong.data.data);
        } else {
          console.log('⚠️ No hay conglomerado activo o datos vacíos');
        }
      } else {
        console.log('⚠️ Usuario no tiene brigada asignada');
      }
    } catch (error) {
      console.error('❌ Error al cargar conglomerado activo:', error);
      console.error('Detalles del error:', error.response?.data);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
        <div className="animate-pulse">
          <div className="h-6 bg-white bg-opacity-20 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-white bg-opacity-20 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!conglomeradoActivo) {
    return (
      <div className="bg-gradient-to-br from-gray-400 to-gray-500 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-start gap-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <MapPin size={28} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-xl mb-2">
              Sin Conglomerado Activo
            </h3>
            <p className="text-sm opacity-90">
              No tienes ningún conglomerado en proceso en este momento.
            </p>
            <p className="text-xs opacity-75 mt-2">
              Espera a que el jefe de brigada inicie el trabajo en un nuevo conglomerado.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <MapPin size={32} />
          </div>
          <div>
            <h3 className="font-bold text-2xl mb-1">
              🌳 Conglomerado en Proceso
            </h3>
            <p className="text-orange-100 text-sm">
              Tu equipo está trabajando actualmente en este sitio
            </p>
          </div>
        </div>
        <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-semibold">
          EN PROCESO
        </span>
      </div>

      <div className="bg-white bg-opacity-10 rounded-lg p-4 mb-4">
        <div className="space-y-3">
          <div>
            <p className="text-orange-100 text-sm mb-1">Nombre del Conglomerado</p>
            <p className="font-bold text-lg">{conglomeradoActivo.nombre}</p>
          </div>
          <div>
            <p className="text-orange-100 text-sm mb-1">Coordenadas</p>
            <p className="font-mono text-sm">
              {parseFloat(conglomeradoActivo.latitud).toFixed(4)}°,{' '}
              {parseFloat(conglomeradoActivo.longitud).toFixed(4)}°
            </p>
          </div>
          <div>
            <p className="text-orange-100 text-sm mb-1">Fecha de Asignación</p>
            <p className="font-semibold flex items-center gap-1">
              <Calendar size={14} />
              {formatearFecha(conglomeradoActivo.fecha_asignacion)}
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate(`/conglomerados/${conglomeradoActivo.id}`)}
        className="w-full bg-white text-orange-600 hover:bg-orange-50 font-semibold py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"
      >
        <MapPin size={18} />
        Ver Detalles
      </button>
    </div>
  );
}

export default ConglomeradoActivoCard;
