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
  BarChart3,
  Microscope,
  Clipboard
} from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  // Menú para Admin y Coordinador
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
    },
    {
      title: 'Generar Conglomerados',
      icon: MapPin,
      description: 'Generar conglomerados aleatorios y aprobarlos',
      path: '/conglomerados/registrar',
      color: 'bg-green-600 hover:bg-green-700',
      roles: ['admin', 'coordinador']
    },
    {
      title: 'Ver Todos los Conglomerados',
      icon: Eye,
      description: 'Lista completa de todos los conglomerados del sistema',
      path: '/conglomerados/lista',
      color: 'bg-green-600 hover:bg-green-700',
      roles: ['admin', 'coordinador']
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
      title: 'Catálogo de Especies',
      icon: FlaskConical,
      description: 'Gestionar catálogo de especies vegetales',
      path: '/especies/gestion',
      color: 'bg-teal-600 hover:bg-teal-700',
      roles: ['admin', 'coordinador', 'botanico']
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

  // Menú para Brigadistas (Jefe, Botánico, Técnico, Coinvestigador)
  const menuBrigadistas = [
    {
      title: 'Mis Conglomerados Asignados',
      icon: Leaf,
      description: 'Ver conglomerados asignados a mi brigada',
      path: '/brigadas/mis-conglomerados',
      color: 'bg-green-600 hover:bg-green-700',
      roles: ['jefe_brigada', 'botanico', 'tecnico_auxiliar', 'coinvestigador']
    },
    {
      title: 'Registrar Muestras',
      icon: Clipboard,
      description: 'Registrar muestras botánicas en campo',
      path: '/muestras/registrar',
      color: 'bg-green-600 hover:bg-green-700',
      roles: ['jefe_brigada', 'botanico', 'tecnico_auxiliar', 'coinvestigador']
    },
    {
      title: 'Consultar Especies',
      icon: FlaskConical,
      description: 'Consultar catálogo de especies (solo lectura)',
      path: '/especies/consulta',
      color: 'bg-teal-600 hover:bg-teal-700',
      roles: ['jefe_brigada', 'botanico', 'tecnico_auxiliar', 'coinvestigador']
    }
  ];

  // Menú para Laboratorio
  const menuLaboratorio = [
    {
      title: 'Clasificación Taxonómica',
      icon: Microscope,
      description: 'Clasificar muestras botánicas del laboratorio',
      path: '/laboratorio/clasificacion',
      color: 'bg-purple-600 hover:bg-purple-700',
      roles: ['laboratorio']
    },
    {
      title: 'Consultar Especies',
      icon: FlaskConical,
      description: 'Consultar catálogo de especies para clasificación',
      path: '/especies/consulta',
      color: 'bg-teal-600 hover:bg-teal-700',
      roles: ['laboratorio']
    }
  ];

  // Determinar qué menú mostrar según el rol
  let menuPrincipal = [];
  let menuEspecial = [];
  
  if (['admin', 'coordinador'].includes(usuario.tipo_usuario)) {
    menuEspecial = menuAdminCoordinador.filter(item => 
      item.roles.includes(usuario.tipo_usuario) && item.badge
    );
    menuPrincipal = menuAdminCoordinador.filter(item => 
      item.roles.includes(usuario.tipo_usuario) && !item.badge
    );
  } else if (['jefe_brigada', 'botanico', 'tecnico_auxiliar', 'coinvestigador'].includes(usuario.tipo_usuario)) {
    menuPrincipal = menuBrigadistas;
  } else if (usuario.tipo_usuario === 'laboratorio') {
    menuPrincipal = menuLaboratorio;
  }

  const getRolNombre = (tipo) => {
    const nombres = {
      admin: 'Administrador',
      coordinador: 'Coordinador',
      jefe_brigada: 'Jefe de Brigada',
      botanico: 'Botánico',
      tecnico_auxiliar: 'Técnico Auxiliar',
      coinvestigador: 'Coinvestigador',
      laboratorio: 'Laboratorio'
    };
    return nombres[tipo] || tipo;
  };

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

        {/* Banner de rol */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-lg shadow-lg mb-6">
          <div className="flex items-center gap-4">
            <div className="bg-white bg-opacity-20 p-4 rounded-full">
              {usuario.tipo_usuario === 'admin' && <UserCog size={32} />}
              {usuario.tipo_usuario === 'coordinador' && <UsersRound size={32} />}
              {['jefe_brigada', 'botanico', 'tecnico_auxiliar', 'coinvestigador'].includes(usuario.tipo_usuario) && <Leaf size={32} />}
              {usuario.tipo_usuario === 'laboratorio' && <Microscope size={32} />}
            </div>
            <div>
              <p className="text-sm opacity-90">Tu rol actual</p>
              <h2 className="text-2xl font-bold">{getRolNombre(usuario.tipo_usuario)}</h2>
              <p className="text-sm opacity-75 mt-1">
                {['admin', 'coordinador'].includes(usuario.tipo_usuario) && 'Gestión y coordinación del sistema'}
                {['jefe_brigada', 'botanico', 'tecnico_auxiliar', 'coinvestigador'].includes(usuario.tipo_usuario) && 'Trabajo de campo y recolección de muestras'}
                {usuario.tipo_usuario === 'laboratorio' && 'Clasificación taxonómica de muestras'}
              </p>
            </div>
          </div>
        </div>

        {/* Botones especiales (Admin/Coordinador) */}
        {menuEspecial.length > 0 && (
          <div className="mb-6 space-y-4">
            {menuEspecial.map((item, index) => {
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

        {/* Grid de opciones principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuPrincipal.map((item, index) => {
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
                {getRolNombre(usuario.tipo_usuario)}
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

        {/* Ayuda contextual según rol */}
        <div className="mt-6 bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <h3 className="font-bold text-blue-900 mb-2">💡 Guía rápida</h3>
          <p className="text-sm text-blue-800">
            {['admin', 'coordinador'].includes(usuario.tipo_usuario) && 
              'Como administrador, puedes gestionar todo el sistema: crear usuarios, brigadas, generar conglomerados y asignarlos a las brigadas de campo.'}
            {['jefe_brigada', 'botanico', 'tecnico_auxiliar', 'coinvestigador'].includes(usuario.tipo_usuario) && 
              'Como brigadista, puedes ver los conglomerados asignados a tu brigada y registrar las muestras botánicas recolectadas en campo.'}
            {usuario.tipo_usuario === 'laboratorio' && 
              'Como personal de laboratorio, puedes clasificar taxonómicamente las muestras recibidas del campo, asignándoles su nombre científico correspondiente.'}
          </p>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
