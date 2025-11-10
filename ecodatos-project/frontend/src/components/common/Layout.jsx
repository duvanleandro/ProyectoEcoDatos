import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, ArrowLeft } from 'lucide-react';
import BannerUsuarioInactivo from './BannerUsuarioInactivo';
import { useUsuario } from '../../context/UsuarioContext';

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { cerrarSesion } = useUsuario();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const handleLogout = () => {
    cerrarSesion();
    navigate('/login');
  };

  const handleVolver = () => {
    navigate('/dashboard');
  };

  // Mostrar botón volver solo si NO estamos en el dashboard
  const mostrarBotonVolver = location.pathname !== '/dashboard';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-accent w-10 h-10 rounded-lg flex items-center justify-center font-bold">
                ED
              </div>
              <span className="text-xl font-bold">EcoDatos</span>
            </div>
            
            {/* Botón Volver */}
            {mostrarBotonVolver && (
              <button
                onClick={handleVolver}
                className="ml-4 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg flex items-center gap-2 transition"
              >
                <ArrowLeft size={18} />
                <span className="hidden sm:inline">Volver al menú</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/perfil')}
              className="hidden md:flex items-center gap-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition"
            >
              <User size={20} />
              <span className="text-sm">
{usuario.nombre_apellidos || usuario.usuario} ({usuario.tipo_usuario})
              </span>
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="p-6">
        <BannerUsuarioInactivo />
        {children}
      </main>
    </div>
  );
}

export default Layout;
