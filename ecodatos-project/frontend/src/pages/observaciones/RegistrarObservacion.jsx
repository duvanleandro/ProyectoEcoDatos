import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import axios from '../../config/axios';
import { API_CONFIG, ENDPOINTS } from '../../config/api';
import { FileText, Save, X, MapPin, CloudRain, TreePine, Upload, Send, Lock, ChevronLeft, ChevronRight, Users } from 'lucide-react';

function RegistrarObservacion() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [mensaje, setMensaje] = useState('');

  // Múltiples conglomerados y brigadas
  const [conglomeradosDisponibles, setConglomeradosDisponibles] = useState([]);
  const [indiceActual, setIndiceActual] = useState(0);

  // Estados para el conglomerado actual seleccionado
  const [conglomerado, setConglomerado] = useState(null);
  const [brigada, setBrigada] = useState(null);
  const [observacionExistente, setObservacionExistente] = useState(null);
  const [puedeEditar, setPuedeEditar] = useState(true);
  const [fotosSubidas, setFotosSubidas] = useState([]);
  const [subiendoFotos, setSubiendoFotos] = useState(false);

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
    cargarConglomeradosDisponibles();
  }, []);

  // Efecto para cargar datos cuando cambia el índice actual
  useEffect(() => {
    if (conglomeradosDisponibles.length > 0) {
      cargarDatosConglomerado(indiceActual);
    }
  }, [indiceActual, conglomeradosDisponibles]);

  const cargarConglomeradosDisponibles = async () => {
    setCargando(true);
    try {
      // 1. Obtener TODAS las brigadas del usuario
      const responseBrigadas = await axios.get(`${API_CONFIG.BRIGADA_SERVICE}${ENDPOINTS.BRIGADA.BASE}/usuario/${usuario.id}/todas`);

      if (!responseBrigadas.data.success || responseBrigadas.data.data.length === 0) {
        setMensaje('❌ No perteneces a ninguna brigada');
        setCargando(false);
        return;
      }

      const brigadas = responseBrigadas.data.data;
      console.log('📋 Brigadas del usuario:', brigadas);

      // 2. Obtener todos los conglomerados
      const responseConglomerados = await axios.get(`${API_CONFIG.CONGLOMERADO_SERVICE}${ENDPOINTS.CONGLOMERADO.BASE}`);
      const todosConglomerados = responseConglomerados.data.data;

      // 3. Para cada brigada, buscar conglomerados disponibles (En_Proceso o Completado sin validar)
      const conglomeradosConBrigada = [];

      for (const brig of brigadas) {
        // Buscar conglomerado EN PROCESO de esta brigada
        let conglomeradoActual = todosConglomerados.find(
          c => c.brigada_id === brig.id && c.estado === 'En_Proceso'
        );

        // Si no hay en proceso, buscar completado NO validado por jefe o sin observación
        if (!conglomeradoActual) {
          const completados = todosConglomerados.filter(
            c => c.brigada_id === brig.id && c.estado === 'Completado'
          );

          for (const comp of completados) {
            try {
              const responseObs = await axios.get(`${API_CONFIG.OBSERVACION_SERVICE}${ENDPOINTS.OBSERVACION.BASE}/conglomerado/${comp.id}`);
              if (responseObs.data.success && responseObs.data.data.length > 0) {
                const obs = responseObs.data.data[0];
                if (!obs.validado_por_jefe) {
                  conglomeradoActual = comp;
                  break;
                }
              } else {
                // No tiene observación registrada, permitir registrarla
                conglomeradoActual = comp;
                break;
              }
            } catch (error) {
              // Si hay error al obtener observación, asumir que no existe
              conglomeradoActual = comp;
              break;
            }
          }
        }

        // Si esta brigada tiene conglomerado disponible, agregarlo a la lista
        if (conglomeradoActual) {
          conglomeradosConBrigada.push({
            conglomerado: conglomeradoActual,
            brigada: brig
          });
        }
      }

      console.log('🌳 Conglomerados disponibles:', conglomeradosConBrigada);

      if (conglomeradosConBrigada.length === 0) {
        setMensaje('⚠️ No tienes ningún conglomerado en proceso o completado. Inicia uno desde "Mis Conglomerados Asignados".');
        setCargando(false);
        return;
      }

      setConglomeradosDisponibles(conglomeradosConBrigada);
      // Cargar el primero automáticamente
      await cargarDatosConglomerado(0, conglomeradosConBrigada);

    } catch (error) {
      console.error('Error al cargar conglomerados:', error);
      setMensaje('❌ Error al cargar información de conglomerados');
      setCargando(false);
    }
  };

  const cargarDatosConglomerado = async (indice, conglomeradosArray = conglomeradosDisponibles) => {
    if (conglomeradosArray.length === 0) return;

    setCargando(true);
    try {
      const { conglomerado: congActual, brigada: brigActual } = conglomeradosArray[indice];
      setConglomerado(congActual);
      setBrigada(brigActual);

      // Buscar si ya existe una observación para este conglomerado
      const responseObs = await axios.get(
        `${API_CONFIG.OBSERVACION_SERVICE}${ENDPOINTS.OBSERVACION.BASE}/conglomerado/${congActual.id}`
      );

      if (responseObs.data.success && responseObs.data.data.length > 0) {
        const obs = responseObs.data.data[0];
        setObservacionExistente(obs);

        // Verificar si puede editar (no validada por jefe ni por admin)
        if (obs.validado_por_jefe || obs.validado) {
          setPuedeEditar(false);
        } else {
          setPuedeEditar(true);
        }

        // Precargar datos de la observación existente
        setFormData({
          id_conglomerado: obs.id_conglomerado,
          id_subparcela: obs.id_subparcela || '',
          id_brigada: obs.id_brigada,
          fecha_observacion: obs.fecha_observacion?.split('T')[0] || new Date().toISOString().split('T')[0],
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
          registrado_por: usuario.id || 1
        });
      } else {
        // No hay observación, usar valores por defecto con el conglomerado
        setObservacionExistente(null);
        setPuedeEditar(true);
        setFormData({
          id_conglomerado: congActual.id,
          id_subparcela: '',
          id_brigada: brigActual.id,
          fecha_observacion: new Date().toISOString().split('T')[0],
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
          registrado_por: usuario.id || 1
        });
      }
    } catch (error) {
      console.error('Error al cargar datos del conglomerado:', error);
      setMensaje('❌ Error al cargar observación');
    } finally {
      setCargando(false);
    }
  };

  const siguienteConglomerado = () => {
    setIndiceActual((prev) => (prev + 1) % conglomeradosDisponibles.length);
  };

  const anteriorConglomerado = () => {
    setIndiceActual((prev) => (prev - 1 + conglomeradosDisponibles.length) % conglomeradosDisponibles.length);
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
    
    if (!puedeEditar) {
      setMensaje('❌ No puedes editar esta observación porque ya fue enviada para revisión');
      return;
    }

    setLoading(true);
    setMensaje('');

    try {
      // Limpiar datos: convertir strings vacíos a null para campos numéricos
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

      let response;
      
      if (observacionExistente) {
        // Actualizar observación existente
        response = await axios.put(
          `${API_CONFIG.OBSERVACION_SERVICE}${ENDPOINTS.OBSERVACION.BASE}/${observacionExistente.id}`,
          datosLimpios
        );
      } else {
        // Crear nueva observación
        response = await axios.post(`${API_CONFIG.OBSERVACION_SERVICE}${ENDPOINTS.OBSERVACION.BASE}`, datosLimpios);
      }
      
      if (response.data.success) {
        setMensaje(`✅ Observación ${observacionExistente ? 'actualizada' : 'registrada'} exitosamente`);
        setTimeout(() => {
          setMensaje('');
        }, 3000);

        // Recargar datos del conglomerado actual
        await cargarDatosConglomerado(indiceActual);
      }
    } catch (error) {
      setMensaje('❌ Error al guardar observación: ' + (error.response?.data?.message || error.message));
      setTimeout(() => setMensaje(''), 8000);
    } finally {
      setLoading(false);
    }
  };

  const handleSubirFotos = async (e) => {
  const archivos = Array.from(e.target.files);
  
  if (!observacionExistente) {
    setMensaje('⚠️ Primero debes guardar la observación antes de subir fotos');
    return;
  }

  if (archivos.length === 0) return;

  setSubiendoFotos(true);
  const formData = new FormData();
  
  archivos.forEach(archivo => {
    formData.append('fotos', archivo);
  });

  try {
    const response = await axios.post(
      `${API_CONFIG.OBSERVACION_SERVICE}${ENDPOINTS.OBSERVACION.BASE}/${observacionExistente.id}/fotos`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );

    if (response.data.success) {
      setMensaje(`✅ ${archivos.length} foto(s) subida(s) exitosamente`);
      setFotosSubidas(response.data.data.fotos || []);
      setTimeout(() => setMensaje(''), 3000);
      // Recargar observación para actualizar fotos
      await cargarDatosConglomerado(indiceActual);
    }
  } catch (error) {
    setMensaje('❌ Error al subir fotos: ' + (error.response?.data?.message || error.message));
  } finally {
    setSubiendoFotos(false);
    e.target.value = ''; // Reset input
  }
};

const handleEliminarFoto = async (nombreFoto) => {
  if (!window.confirm('¿Eliminar esta foto?')) return;

  try {
    const response = await axios.delete(
      `${API_CONFIG.OBSERVACION_SERVICE}${ENDPOINTS.OBSERVACION.BASE}/${observacionExistente.id}/fotos/${nombreFoto}`
    );

    if (response.data.success) {
      setMensaje('✅ Foto eliminada');
      setFotosSubidas(response.data.data.fotos || []);
      setTimeout(() => setMensaje(''), 3000);
    }
  } catch (error) {
    setMensaje('❌ Error al eliminar foto');
  }
};
  const enviarParaRevision = async () => {
    if (!window.confirm('¿Estás seguro de enviar esta observación para revisión? No podrás editarla después.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${API_CONFIG.OBSERVACION_SERVICE}${ENDPOINTS.OBSERVACION.BASE}/${observacionExistente.id}/validar-jefe`,
        { idJefe: usuario.id }
      );

      if (response.data.success) {
        setMensaje('✅ Observación enviada para revisión exitosamente');
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (error) {
      setMensaje('❌ Error al enviar observación: ' + (error.response?.data?.message || error.message));
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
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
            >
              Ir a Mis Conglomerados
            </button>
          </div>
        </div>
      </Layout>
    );
  }

const esJefeBrigada = usuario.tipo_usuario === 'jefe_brigada';
  const conglomeradoCompletado = conglomerado?.estado === 'Completado';
  const puedeEnviar = esJefeBrigada && conglomeradoCompletado && observacionExistente && !observacionExistente.validado_por_jefe;

  const tieneMuchosConglomerados = conglomeradosDisponibles.length > 1;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header con carrusel */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-8 h-8 text-green-600" />
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">
                    {observacionExistente ? 'Editar' : 'Registrar'} Observación de Campo
                    {!puedeEditar && <Lock className="inline-block w-6 h-6 ml-2 text-red-500" />}
                  </h1>
                  {tieneMuchosConglomerados && (
                    <p className="text-xs text-blue-600">
                      📋 Tienes {conglomeradosDisponibles.length} conglomerados disponibles. Usa las flechas para cambiar.
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
                Volver
              </button>
            </div>

            {/* Card de Brigada y Conglomerado con carrusel */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                {/* Botón anterior (solo si hay múltiples) */}
                {tieneMuchosConglomerados && (
                  <button
                    onClick={anteriorConglomerado}
                    className="bg-white p-2 rounded-lg hover:bg-gray-100 shadow transition"
                    title="Conglomerado anterior"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                )}

                {/* Información central */}
                <div className="flex-1 mx-4">
                  {/* Brigada */}
                  <div className="mb-3 bg-white bg-opacity-70 rounded-lg p-3 border border-blue-200">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-semibold text-blue-600 uppercase">Brigada</span>
                    </div>
                    <p className="font-bold text-lg text-gray-800">{brigada?.nombre || 'Cargando...'}</p>
                    <p className="text-xs text-gray-600">{brigada?.zona_designada || 'Sin zona asignada'}</p>
                  </div>

                  {/* Conglomerado */}
                  <div className="bg-white bg-opacity-70 rounded-lg p-3 border border-green-200">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-green-600" />
                      <span className="text-xs font-semibold text-green-600 uppercase">Conglomerado</span>
                    </div>
                    <p className="font-bold text-lg text-gray-800">{conglomerado.nombre}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
                      <span><strong>ID:</strong> {conglomerado.id}</span>
                      <span><strong>Estado:</strong> {conglomerado.estado}</span>
                      <span><strong>Ubicación:</strong> {conglomerado.ubicacion}</span>
                    </div>
                  </div>
                </div>

                {/* Botón siguiente (solo si hay múltiples) */}
                {tieneMuchosConglomerados ? (
                  <div className="flex flex-col items-center gap-2">
                    <button
                      onClick={siguienteConglomerado}
                      className="bg-white p-2 rounded-lg hover:bg-gray-100 shadow transition"
                      title="Conglomerado siguiente"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-700" />
                    </button>
                    <span className="text-xs font-semibold text-gray-600 bg-white px-2 py-1 rounded">
                      {indiceActual + 1} / {conglomeradosDisponibles.length}
                    </span>
                  </div>
                ) : (
                  <div className="w-10" />
                )}
              </div>
            </div>
          </div>

          {/* Alerta si no puede editar */}
          {!puedeEditar && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <Lock className="w-5 h-5" />
                <span className="font-semibold">Esta observación ya fue enviada para revisión y no puede ser modificada.</span>
              </div>
            </div>
          )}

          {mensaje && (
            <div className={`mb-4 p-4 rounded-lg ${
              mensaje.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 
              mensaje.includes('⚠️') ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
              'bg-red-50 text-red-800 border border-red-200'
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
                    disabled={!puedeEditar}
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
                    disabled={!puedeEditar}
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
                    disabled={!puedeEditar}
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
                    disabled={!puedeEditar}
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
                    disabled={!puedeEditar}
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
                    disabled={!puedeEditar}
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
                    disabled={!puedeEditar}
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
                    disabled={!puedeEditar}
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
                    disabled={!puedeEditar}
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
  
  {/* Input para subir fotos */}
  {puedeEditar && (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Agregar fotos (máx. 5MB cada una)
      </label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleSubirFotos}
        disabled={subiendoFotos || !observacionExistente}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
      />
      {!observacionExistente && (
        <p className="text-sm text-yellow-600 mt-1">
          💡 Guarda primero la observación para poder subir fotos
        </p>
      )}
      {subiendoFotos && (
        <p className="text-sm text-blue-600 mt-1">Subiendo fotos...</p>
      )}
    </div>
  )}

  {/* Galería de fotos */}
  {observacionExistente?.fotos && observacionExistente.fotos.length > 0 && (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {observacionExistente.fotos.map((foto, index) => (
        <div key={index} className="relative group">
          <img
            src={`${API_CONFIG.OBSERVACION_SERVICE}/uploads/observaciones/${observacionExistente.id}/${foto}`}
            alt={`Foto ${index + 1}`}
            className="w-full h-32 object-cover rounded-lg border"
          />
          {puedeEditar && (
            <button
              type="button"
              onClick={() => handleEliminarFoto(foto)}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
    </div>
  )}
  
  {(!observacionExistente?.fotos || observacionExistente.fotos.length === 0) && (
    <p className="text-sm text-gray-500 italic">No se han subido fotos aún</p>
  )}
</div>
            {/* Botones */}
            <div className="flex justify-between items-center gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Volver
              </button>

              <div className="flex gap-4">
                {puedeEditar && (
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                  >
                    <Save className="w-5 h-5" />
                    {loading ? 'Guardando...' : (observacionExistente ? 'Actualizar' : 'Guardar')}
                  </button>
                )}

                {puedeEnviar && (
                  <button
                    type="button"
                    onClick={enviarParaRevision}
                    disabled={loading}
                    className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                  >
                    <Send className="w-5 h-5" />
                    Enviar para Revisión
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default RegistrarObservacion;
