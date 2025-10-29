import { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { UserPlus, Users, Trash2, Search, Eye, EyeOff } from 'lucide-react';
import axios from 'axios';

function GestionUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  
  const [nuevoUsuario, setNuevoUsuario] = useState({
    usuario: '',
    contrasena: '',
    tipo_usuario: 'jefe_brigada',
    nombre_apellidos: '',
    telefono: '',
    email: '',
    especialidad: ''
  });

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3001/api/auth/usuarios', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setUsuarios(response.data.data);
      }
    } catch (error) {
      setMensaje('❌ Error al cargar usuarios: ' + error.message);
    }
  };

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('');

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3001/api/auth/crear-usuario',
        nuevoUsuario,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setMensaje('✅ Usuario creado exitosamente');
        setMostrarFormulario(false);
        setNuevoUsuario({
          usuario: '',
          contrasena: '',
          tipo_usuario: 'jefe_brigada',
          nombre_apellidos: '',
          telefono: '',
          email: '',
          especialidad: ''
        });
        cargarUsuarios();
      }
    } catch (error) {
      setMensaje('❌ ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEliminarUsuario = async (id, usuario) => {
    if (!window.confirm(`¿Eliminar usuario "${usuario}"?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        `http://localhost:3001/api/auth/usuarios/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setMensaje('✅ Usuario eliminado exitosamente');
        cargarUsuarios();
      }
    } catch (error) {
      setMensaje('❌ ' + (error.response?.data?.message || error.message));
    }
  };

  const usuariosFiltrados = usuarios.filter(u =>
    u.usuario.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.nombre_apellidos?.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.tipo_usuario.toLowerCase().includes(busqueda.toLowerCase())
  );

  const getRolBadgeColor = (rol) => {
    switch(rol) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'jefe_brigada':
        return 'bg-blue-100 text-blue-800';
      case 'botanico':
        return 'bg-green-100 text-green-800';
      case 'tecnico_auxiliar':
        return 'bg-yellow-100 text-yellow-800';
      case 'coinvestigador':
        return 'bg-orange-100 text-orange-800';
      case 'laboratorio':
        return 'bg-pink-100 text-pink-800';
      case 'coordinador':
        return 'bg-indigo-100 text-indigo-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRolNombre = (rol) => {
    const nombres = {
      admin: 'Administrador',
      jefe_brigada: 'Jefe de Brigada',
      botanico: 'Botánico',
      tecnico_auxiliar: 'Técnico Auxiliar',
      coinvestigador: 'Coinvestigador',
      laboratorio: 'Laboratorio',
      coordinador: 'Coordinador'
    };
    return nombres[rol] || rol;
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Gestión de Usuarios
          </h1>
          <p className="text-gray-600">
            Administra los usuarios del sistema y sus roles
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Total Usuarios</p>
            <p className="text-2xl font-bold text-gray-800">{usuarios.length}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Jefes de Brigada</p>
            <p className="text-2xl font-bold text-blue-600">
              {usuarios.filter(u => u.tipo_usuario === 'jefe_brigada').length}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Botánicos</p>
            <p className="text-2xl font-bold text-green-600">
              {usuarios.filter(u => u.tipo_usuario === 'botanico').length}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <p className="text-sm text-gray-600">Técnicos</p>
            <p className="text-2xl font-bold text-yellow-600">
              {usuarios.filter(u => u.tipo_usuario === 'tecnico_auxiliar').length}
            </p>
          </div>
        </div>

        {/* Mensaje */}
        {mensaje && (
          <div className={`mb-4 p-3 rounded-lg text-sm ${
            mensaje.includes('✅') 
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            {mensaje}
          </div>
        )}

        {/* Controles */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* Botón Crear Usuario */}
            <button
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
              className="bg-primary hover:bg-secondary text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              <UserPlus size={20} />
              {mostrarFormulario ? 'Cancelar' : 'Crear Usuario'}
            </button>

            {/* Buscador */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Buscar por usuario, nombre o rol..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>

            <button
              onClick={cargarUsuarios}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
            >
              Recargar
            </button>
          </div>
        </div>

        {/* Formulario Crear Usuario */}
        {mostrarFormulario && (
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-xl font-bold mb-4">Crear Nuevo Usuario</h2>
            <form onSubmit={handleCrearUsuario}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Usuario */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Usuario / Correo *
                  </label>
                  <input
                    type="text"
                    value={nuevoUsuario.usuario}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, usuario: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                {/* Contraseña */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Contraseña *
                  </label>
                  <div className="relative">
                    <input
                      type={mostrarContrasena ? 'text' : 'password'}
                      value={nuevoUsuario.contrasena}
                      onChange={(e) => setNuevoUsuario({...nuevoUsuario, contrasena: e.target.value})}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarContrasena(!mostrarContrasena)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                    >
                      {mostrarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Rol */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Rol *
                  </label>
                  <select
                    value={nuevoUsuario.tipo_usuario}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, tipo_usuario: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  >
                    <option value="jefe_brigada">Jefe de Brigada</option>
                    <option value="botanico">Botánico</option>
                    <option value="tecnico_auxiliar">Técnico Auxiliar</option>
                    <option value="coinvestigador">Coinvestigador</option>
                    <option value="laboratorio">Laboratorio</option>
                    <option value="coordinador">Coordinador</option>
                  </select>
                </div>

                {/* Nombre */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    value={nuevoUsuario.nombre_apellidos}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, nombre_apellidos: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                {/* Teléfono */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={nuevoUsuario.telefono}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, telefono: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={nuevoUsuario.email}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, email: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Especialidad */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Especialidad / Formación
                  </label>
                  <input
                    type="text"
                    value={nuevoUsuario.especialidad}
                    onChange={(e) => setNuevoUsuario({...nuevoUsuario, especialidad: e.target.value})}
                    placeholder="Ej: Ingeniería Forestal, Botánica, Técnico Forestal, etc."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary hover:bg-secondary text-white px-6 py-3 rounded-lg flex items-center gap-2 transition disabled:opacity-50"
                >
                  <UserPlus size={20} />
                  {loading ? 'Creando...' : 'Crear Usuario'}
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarFormulario(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg transition"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabla de Usuarios */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Users size={24} />
              Lista de Usuarios ({usuariosFiltrados.length})
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">Usuario</th>
                  <th className="text-left">Nombre</th>
                  <th className="text-left">Rol</th>
                  <th className="text-left">Contacto</th>
                  <th className="text-left">Especialidad</th>
                  <th className="text-left">Estado</th>
                  <th className="text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      No se encontraron usuarios
                    </td>
                  </tr>
                ) : (
                  usuariosFiltrados.map((usuario) => (
                    <tr key={usuario.id}>
                      <td className="font-medium">{usuario.usuario}</td>
                      <td>{usuario.nombre_apellidos || '-'}</td>
                      <td>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRolBadgeColor(usuario.tipo_usuario)}`}>
                          {getRolNombre(usuario.tipo_usuario)}
                        </span>
                      </td>
                      <td className="text-sm">
                        {usuario.telefono && <div>{usuario.telefono}</div>}
                        {usuario.email && <div className="text-gray-500">{usuario.email}</div>}
                        {!usuario.telefono && !usuario.email && '-'}
                      </td>
                      <td className="text-sm text-gray-600">
                        {usuario.especialidad || '-'}
                      </td>
                      <td>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          usuario.activo 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {usuario.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        {usuario.tipo_usuario !== 'admin' && (
                          <button
                            onClick={() => handleEliminarUsuario(usuario.id, usuario.usuario)}
                            className="text-red-500 hover:text-red-700 flex items-center gap-1"
                          >
                            <Trash2 size={16} />
                            <span className="text-sm">Eliminar</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default GestionUsuarios;
