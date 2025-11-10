import { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { User, Lock, Eye, EyeOff, Save } from 'lucide-react';
import axios from '../../config/axios';
import { API_CONFIG, ENDPOINTS } from '../../config/api';

function MiPerfil() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState('');
  const [mostrarCambiarContrasena, setMostrarCambiarContrasena] = useState(false);
  const [mostrarContrasenas, setMostrarContrasenas] = useState({
    actual: false,
    nueva: false,
    confirmar: false
  });

  const [formContrasena, setFormContrasena] = useState({
    contrasenaActual: '',
    contrasenaNueva: '',
    confirmarContrasena: ''
  });

  useEffect(() => {
    cargarPerfil();
  }, []);

  const cargarPerfil = async () => {
    try {
      const response = await axios.get(`${API_CONFIG.AUTH_SERVICE}${ENDPOINTS.AUTH.PERFIL}`);

      if (response.data.success) {
        setPerfil(response.data.data);
      }
    } catch (error) {
      setMensaje('Error al cargar perfil: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCambiarContrasena = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    // Validaciones
    if (formContrasena.contrasenaNueva !== formContrasena.confirmarContrasena) {
      setMensaje('❌ Las contraseñas nuevas no coinciden');
      setLoading(false);
      return;
    }

    if (formContrasena.contrasenaNueva.length < 6) {
      setMensaje('❌ La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_CONFIG.AUTH_SERVICE}${ENDPOINTS.AUTH.CAMBIAR_CONTRASENA}`,
        {
          contrasenaActual: formContrasena.contrasenaActual,
          contrasenaNueva: formContrasena.contrasenaNueva
        }
      );

      if (response.data.success) {
        setMensaje('✅ ' + response.data.message);
        setFormContrasena({
          contrasenaActual: '',
          contrasenaNueva: '',
          confirmarContrasena: ''
        });
        setMostrarCambiarContrasena(false);
      }
    } catch (error) {
      setMensaje('❌ ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const toggleMostrarContrasena = (campo) => {
    setMostrarContrasenas(prev => ({
      ...prev,
      [campo]: !prev[campo]
    }));
  };

  if (loading && !perfil) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Cargando perfil...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Header */}
          <div className="flex items-center mb-6 border-b pb-4">
            <User className="w-8 h-8 text-green-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>
          </div>

          {/* Mensaje */}
          {mensaje && (
            <div className={`mb-4 p-4 rounded-lg ${
              mensaje.includes('✅') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {mensaje}
            </div>
          )}

          {/* Información del Perfil */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <input
                type="text"
                value={perfil?.usuario || ''}
                disabled
                className="w-full p-3 border rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Usuario
              </label>
              <input
                type="text"
                value={perfil?.tipo_usuario || ''}
                disabled
                className="w-full p-3 border rounded-lg bg-gray-50 text-gray-600 capitalize"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                value={perfil?.nombre_apellidos || 'No especificado'}
                disabled
                className="w-full p-3 border rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={perfil?.email || 'No especificado'}
                disabled
                className="w-full p-3 border rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Teléfono
              </label>
              <input
                type="text"
                value={perfil?.telefono || 'No especificado'}
                disabled
                className="w-full p-3 border rounded-lg bg-gray-50 text-gray-600"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Especialidad
              </label>
              <input
                type="text"
                value={perfil?.especialidad || 'No especificado'}
                disabled
                className="w-full p-3 border rounded-lg bg-gray-50 text-gray-600"
              />
            </div>
          </div>

          {/* Botón Cambiar Contraseña */}
          <div className="border-t pt-6">
            <button
              onClick={() => setMostrarCambiarContrasena(!mostrarCambiarContrasena)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Lock className="w-4 h-4" />
              {mostrarCambiarContrasena ? 'Cancelar' : 'Cambiar Contraseña'}
            </button>
          </div>

          {/* Formulario Cambiar Contraseña */}
          {mostrarCambiarContrasena && (
            <form onSubmit={handleCambiarContrasena} className="mt-6 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">Cambiar Contraseña</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contraseña Actual *
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarContrasenas.actual ? 'text' : 'password'}
                      value={formContrasena.contrasenaActual}
                      onChange={(e) => setFormContrasena({...formContrasena, contrasenaActual: e.target.value})}
                      required
                      className="w-full p-3 pr-10 border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => toggleMostrarContrasena('actual')}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {mostrarContrasenas.actual ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nueva Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarContrasenas.nueva ? 'text' : 'password'}
                      value={formContrasena.contrasenaNueva}
                      onChange={(e) => setFormContrasena({...formContrasena, contrasenaNueva: e.target.value})}
                      required
                      minLength={6}
                      className="w-full p-3 pr-10 border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => toggleMostrarContrasena('nueva')}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {mostrarContrasenas.nueva ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmar Nueva Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarContrasenas.confirmar ? 'text' : 'password'}
                      value={formContrasena.confirmarContrasena}
                      onChange={(e) => setFormContrasena({...formContrasena, confirmarContrasena: e.target.value})}
                      required
                      minLength={6}
                      className="w-full p-3 pr-10 border rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => toggleMostrarContrasena('confirmar')}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {mostrarContrasenas.confirmar ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400"
                >
                  <Save className="w-4 h-4" />
                  {loading ? 'Guardando...' : 'Guardar Nueva Contraseña'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default MiPerfil;
