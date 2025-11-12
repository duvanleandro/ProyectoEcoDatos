import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, User } from 'lucide-react';
import axios from '../../config/axios';
import { API_CONFIG, ENDPOINTS } from '../../config/api';

function ConglomeradoActivoCard({ usuario }) {
  const navigate = useNavigate();
  const [conglomeradoActivo, setConglomeradoActivo] = useState(null);
  const [brigada, setBrigada] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarConglomeradoActivo();
  }, []);

  const cargarConglomeradoActivo = async () => {
    try {
      setLoading(true);

      // Primero obtener la brigada del usuario con sus integrantes
      console.log('🔍 Buscando brigada para usuario:', usuario.id);
      const respBrigada = await axios.get(
        `${API_CONFIG.BRIGADA_SERVICE}${ENDPOINTS.BRIGADA.USUARIO(usuario.id)}`
      );

      console.log('📋 Respuesta brigada:', respBrigada.data);

      if (respBrigada.data.success && respBrigada.data.data?.id) {
        const brigadaData = respBrigada.data.data;
        const brigadaId = brigadaData.id;
        console.log('✅ Brigada encontrada, ID:', brigadaId);

        // Guardar información de la brigada con sus integrantes
        setBrigada(brigadaData);

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

  const getRolNombre = (rol) => {
    const nombres = {
      jefe_brigada: 'Jefe de Brigada',
      botanico: 'Botánico',
      tecnico_auxiliar: 'Técnico Auxiliar',
      coinvestigador: 'Coinvestigador'
    };
    return nombres[rol] || rol;
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

  // Si no tiene brigada asignada
  if (!brigada) {
    return (
      <div className="bg-gradient-to-br from-gray-400 to-gray-500 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-start gap-4">
          <div className="bg-white bg-opacity-20 p-3 rounded-lg">
            <Users size={28} />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-xl mb-2">
              Sin Brigada Asignada
            </h3>
            <p className="text-sm opacity-90">
              No estás asignado a ninguna brigada en este momento.
            </p>
            <p className="text-xs opacity-75 mt-2">
              Contacta al administrador para que te asigne a una brigada.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Si tiene brigada pero no conglomerado activo
  if (!conglomeradoActivo) {
    return (
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <Users size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg">{brigada.nombre}</h3>
              <p className="text-blue-100 text-xs">{brigada.zona_designada || 'Sin zona asignada'}</p>
            </div>
          </div>
          {brigada.total_brigadas > 1 && (
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs font-semibold">
              {brigada.total_brigadas} brigadas
            </span>
          )}
        </div>

        {/* Integrantes en grid compacto */}
        {brigada.integrantes && brigada.integrantes.length > 0 && (
          <div className="bg-white bg-opacity-10 rounded-lg p-3">
            <p className="text-blue-100 text-xs mb-2 font-semibold">
              Equipo ({brigada.integrantes.length})
            </p>
            <div className="grid grid-cols-2 gap-2">
              {brigada.integrantes.map((integrante) => (
                <div key={integrante.id} className="bg-white bg-opacity-20 rounded p-2 text-xs">
                  <p className="font-semibold truncate">{integrante.nombre_apellidos}</p>
                  <p className="text-blue-100 text-[10px]">{getRolNombre(integrante.rol)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-3 bg-white bg-opacity-10 rounded-lg p-3 text-center">
          <p className="text-sm opacity-90">Sin conglomerado activo</p>
          <p className="text-xs opacity-75 mt-1">Espera nueva asignación</p>
        </div>
      </div>
    );
  }

  // Si tiene brigada y conglomerado activo
  return (
    <div className="space-y-3">
      {/* Información de la Brigada - Compacta */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <Users size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg">{brigada.nombre}</h3>
              <p className="text-blue-100 text-xs">{brigada.zona_designada || 'Sin zona'}</p>
            </div>
          </div>
          {brigada.total_brigadas > 1 && (
            <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs font-semibold">
              {brigada.total_brigadas} brigadas
            </span>
          )}
        </div>

        {/* Integrantes en grid compacto */}
        {brigada.integrantes && brigada.integrantes.length > 0 && (
          <div className="bg-white bg-opacity-10 rounded-lg p-3">
            <p className="text-blue-100 text-xs mb-2 font-semibold">
              Equipo ({brigada.integrantes.length})
            </p>
            <div className="grid grid-cols-2 gap-2">
              {brigada.integrantes.map((integrante) => (
                <div key={integrante.id} className="bg-white bg-opacity-20 rounded p-2 text-xs">
                  <p className="font-semibold truncate">{integrante.nombre_apellidos}</p>
                  <p className="text-blue-100 text-[10px]">{getRolNombre(integrante.rol)}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Conglomerado Activo - Compacto */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-4 rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer"
           onClick={() => navigate(`/conglomerados/${conglomeradoActivo.id}`)}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="bg-white bg-opacity-20 p-2 rounded-lg">
              <MapPin size={20} />
            </div>
            <div>
              <h3 className="font-bold text-lg">Conglomerado en Proceso</h3>
              <p className="text-orange-100 text-xs">{conglomeradoActivo.nombre}</p>
            </div>
          </div>
          <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs font-semibold">
            ACTIVO
          </span>
        </div>

        <div className="bg-white bg-opacity-10 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-orange-100">Coordenadas:</span>
            <span className="font-mono font-semibold">
              {parseFloat(conglomeradoActivo.latitud).toFixed(4)}°, {parseFloat(conglomeradoActivo.longitud).toFixed(4)}°
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-orange-100">Asignado:</span>
            <span className="font-semibold flex items-center gap-1">
              <Calendar size={12} />
              {formatearFecha(conglomeradoActivo.fecha_asignacion)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConglomeradoActivoCard;
