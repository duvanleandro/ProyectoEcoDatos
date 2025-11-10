import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../../context/UsuarioContext';
import axios from '../../config/axios';
import { API_CONFIG, ENDPOINTS } from '../../config/api';

function Login() {
  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { actualizarUsuario } = useUsuario();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_CONFIG.AUTH_SERVICE}${ENDPOINTS.AUTH.LOGIN}`, formData);

      if (response.data.success) {
        // Guardar token
        localStorage.setItem('token', response.data.data.token);

        // Actualizar contexto de usuario
        actualizarUsuario(response.data.data.usuario);

        // Mostrar advertencia si el usuario está inactivo
        if (response.data.data.usuario.activo === false) {
          setError('⚠️ Tu cuenta está desactivada. Solo puedes visualizar datos, no realizar modificaciones.');
          setTimeout(() => {
            navigate('/dashboard');
          }, 2000);
        } else {
          // Redirigir al dashboard
          navigate('/dashboard');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-green-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header verde */}
        <div className="bg-primary text-white p-6">
          <div className="flex items-center gap-3">
            <div className="bg-accent w-12 h-12 rounded-lg flex items-center justify-center font-bold text-xl">
              ED
            </div>
            <div>
              <h1 className="text-2xl font-bold">EcoDatos</h1>
              <p className="text-sm text-green-200">Inicio de sesión</p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Campo Usuario */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Usuario o correo
              </label>
              <input
                type="text"
                name="usuario"
                value={formData.usuario}
                onChange={handleChange}
                placeholder="tu@correo.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Campo Contraseña */}
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Contraseña
              </label>
              <input
                type="password"
                name="contrasena"
                value={formData.contrasena}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
                required
              />
            </div>

            {/* Olvidé contraseña */}
            <div className="text-right">
              <a href="#" className="text-sm text-primary hover:text-secondary">
                Olvidé mi contraseña
              </a>
            </div>

            {/* Botón de Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-accent hover:bg-green-500 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </button>

            {/* Mensaje adicional */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Accede para continuar con tus datos forestales.
            </p>
          </form>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t">
          <p className="text-center text-xs text-gray-500">
            © 2025 EcoDatos - Todos los derechos reservados
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
