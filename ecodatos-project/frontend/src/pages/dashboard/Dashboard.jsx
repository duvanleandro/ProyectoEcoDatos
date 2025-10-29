import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { 
  MapPin, 
  Users, 
  Eye, 
  Leaf,
  UserCog,
  UsersRound,
  FlaskConical,
  BarChart3
} from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  const esAdmin = usuario.tipo_usuario === 'admin';
  const esCoordinador = usuario.tipo_usuario === 'coordinador';
  const esLaboratorio = usuario.tipo_usuario === 'laboratorio';
  const esBrigadista = ['jefe_brigada', 'botanico', 'tecnico_auxiliar', 'coinvestigador'].includes(usuario.tipo_usuario);

  const menuItems = [
    {
      title: 'Generar Conglomerados',
      icon: MapPin,
      description: 'Generar conglomerados aleatorios y aprobarlos',
      path: '/conglomerados/registrar',
      color: 'bg-green-600 hover:bg-green-700',
      roles: ['admin', 'coordinador']
    },
    {
      title: 'Ver Conglomerados',
      icon: Eye,
      description: 'Lista completa con filtros y mapa interactivo',
      path: '/conglomerados/lista',
      color: 'bg-green-600 hover:bg-green-700',
      roles: ['admin', 'coordinador', 'jefe_brigada', 'botanico']
    },
    {
      title: 'Asignar Brigadas a Conglomerados',
      icon: Users,
      description: 'Asignar brigadas activas a conglomerados aprobados',
      path: '/brigadas/asignar',
      color: 'bg-green-600 hover:bg-green-700',
      roles: ['admin', 'coordinador']
    },
    {
      title: 'Mis Conglomerados Asignados',
      icon: Leaf,
      description: 'Ver mis conglomerados y registrar muestras',
      path: '/brigadas/mis-conglomerados',
      color: 'bg-green-600 hover:bg-green-700',
      roles: ['jefe_brigada', 'botanico', 'tecnico_auxiliar', 'coinvestigador']
    },
    {
      title: 'Gestión de Especies',
      icon: FlaskConical,
      description: 'Catálogo de especies vegetales',
      path: '/especies/gestion',
      color: 'bg-teal-600 hover:bg-teal-700',
      roles: ['admin', 'coordinador', 'laboratorio', 'botanico']
    },
    {
      title: 'Clasificación Taxonómica',
      icon: FlaskConical,
      description: 'Clasificar muestras del laboratorio',
      path: '/laboratorio/clasificacion',
      color: 'bg-purple-600 hover:bg-purple-700',
      roles: ['laboratorio']
    },
    {
      title: 'Indicadores y Reportes',
      icon: BarChart3,
      description: 'Estadísticas y análisis forestales',
      path: '/reportes',
      color: 'bg-blue-600 hover:bg-blue-700',
      roles: ['admin', 'coordinador']
    }
  ];

  // Menús exclusivos para admin/coordinador
  const menuAdminCoordinador = [
    {
      title: 'Gestión de Usuarios',
      icon: UserCog,
      description: 'Crear y administrar usuarios del sistema',
      path: '/admin/usuarios',
      color: 'bg-purple-600 hover:bg-purple-700',
      badge: 'ADMIN',
      roles: ['admin']
    },
    {
      title: 'Gestión de Brigadas',
      icon: UsersRound,
      description: 'Crear brigadas y asignar integrantes',
      path: '/brigadas/gestion',
      color: 'bg-blue-600 hover:bg-blue-700',
      badge: 'ADMIN',
      roles: ['admin', 'coordinador']
    }
  ];

  // Filtrar menú según rol
  const menuFiltrado = menuItems.filter(item => 
    !item.roles || item.roles.includes(usuario.tipo_usuario)
  );

  const menuEspecialFiltrado = menuAdminCoordinador.filter(item =>
    item.roles.includes(usuario.tipo_usuario)
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Título */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Menú Principal
          </h1>
          <p className="text-gray-600">
            Bienvenido, {usuario.usuario}. Selecciona una opción para continuar.
          </p>
        </div>

        {/* Botones Admin/Coordinador */}
        {menuEspecialFiltrado.length > 0 && (
          <div className="mb-6 space-y-4">
            {menuEspecialFiltrado.map((item, index) => {
              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(item.path)}
                  className={`${item.color} text-white p-6 rounded-lg shadow-md transition transform hover:scale-105 text-left w-full`}
                >
                  <div className="flex items-start gap-4">
                    <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                      <Icon size={28} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm opacity-90">
                        {item.description}
                      </p>
                    </div>
                    <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-xs font-semibold">
                      {item.badge}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Grid de opciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuFiltrado.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => navigate(item.path)}
                className={`${item.color} text-white p-6 rounded-lg shadow-md transition transform hover:scale-105 text-left`}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-white bg-opacity-20 p-3 rounded-lg">
                    <Icon size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm opacity-90">
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Información adicional */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Información del Sistema
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Rol actual</p>
              <p className="text-2xl font-bold text-primary capitalize">
                {usuario.tipo_usuario === 'admin' ? 'Administrador' :
                 usuario.tipo_usuario === 'jefe_brigada' ? 'Jefe de Brigada' :
                 usuario.tipo_usuario === 'botanico' ? 'Botánico' :
                 usuario.tipo_usuario === 'tecnico_auxiliar' ? 'Técnico Auxiliar' :
                 usuario.tipo_usuario === 'coinvestigador' ? 'Coinvestigador' :
                 usuario.tipo_usuario === 'laboratorio' ? 'Laboratorio' :
                 usuario.tipo_usuario === 'coordinador' ? 'Coordinador' :
                 usuario.tipo_usuario}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Estado del sistema</p>
              <p className="text-2xl font-bold text-green-600">
                Activo
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Última actualización</p>
              <p className="text-2xl font-bold text-gray-700">
                {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
