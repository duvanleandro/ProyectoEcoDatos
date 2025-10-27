import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import { 
  MapPin, 
  Users, 
  Eye, 
  Filter, 
  Map, 
  Leaf 
} from 'lucide-react';

function Dashboard() {
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  const menuItems = [
    {
      title: 'Registrar Conglomerado',
      icon: MapPin,
      description: 'Registrar nuevo conglomerado forestal',
      path: '/conglomerados/registrar',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Asignar Brigada a Conglomerado',
      icon: Users,
      description: 'Asignar brigadas a conglomerados',
      path: '/brigadas/asignar',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Ver Conglomerados',
      icon: Eye,
      description: 'Lista de todos los conglomerados',
      path: '/conglomerados/lista',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Filtrar y Consultar Conglomerados',
      icon: Filter,
      description: 'Buscar conglomerados por criterios',
      path: '/conglomerados/filtrar',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Consultar Ubicación de Conglomerado',
      icon: Map,
      description: 'Ver ubicación en mapa',
      path: '/conglomerados/ubicacion',
      color: 'bg-green-600 hover:bg-green-700'
    },
    {
      title: 'Brigadistas - Conglomerados Asignados',
      icon: Leaf,
      description: 'Ver conglomerados asignados a brigadistas',
      path: '/brigadas/conglomerados',
      color: 'bg-green-600 hover:bg-green-700'
    }
  ];

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

        {/* Grid de opciones */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => {
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
                    <p className="text-sm text-green-100">
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
                {usuario.tipo_usuario}
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
