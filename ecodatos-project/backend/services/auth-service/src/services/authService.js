const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const { sequelize } = require('../config/database');

class AuthService {
  async register(usuarioData) {
    const { usuario, contrasena, tipo_usuario, id_integrante } = usuarioData;

    // Verificar si el usuario ya existe
    const existeUsuario = await Usuario.findOne({ where: { usuario } });
    if (existeUsuario) {
      throw new Error('El usuario ya existe');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      usuario,
      contraseña: hashedPassword,
      tipo_usuario: tipo_usuario || 'brigadista',
      id_integrante
    });

    return {
      id: nuevoUsuario.id,
      usuario: nuevoUsuario.usuario,
      tipo_usuario: nuevoUsuario.tipo_usuario
    };
  }

async login(usuario, contrasena) {
  // Buscar usuario con su información de integrante usando SQL raw
  const [usuarioEncontrado] = await sequelize.query(`
    SELECT u.*, i.nombre_apellidos, i.email, i.telefono
    FROM usuarios u
    LEFT JOIN integrante i ON u.id_integrante = i.id
    WHERE u.usuario = :usuario
    LIMIT 1
  `, {
    replacements: { usuario },
    type: sequelize.QueryTypes.SELECT
  });

  if (!usuarioEncontrado) {
    throw new Error('Credenciales inválidas');
  }

  // Verificar si el usuario está activo
  if (!usuarioEncontrado.activo) {
    throw new Error('Tu cuenta está inactiva. Contacta al administrador para reactivarla.');
  }

  // Verificar contraseña
  const passwordValida = await bcrypt.compare(contrasena, usuarioEncontrado.contraseña);
  if (!passwordValida) {
    throw new Error('Credenciales inválidas');
  }
  
  // Generar JWT
  const token = jwt.sign(
    {
      id: usuarioEncontrado.id,
      usuario: usuarioEncontrado.usuario,
      tipo_usuario: usuarioEncontrado.tipo_usuario
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
  
  return {
    token,
    usuario: {
      id: usuarioEncontrado.id,
      usuario: usuarioEncontrado.usuario,
      tipo_usuario: usuarioEncontrado.tipo_usuario,
      nombre_apellidos: usuarioEncontrado.nombre_apellidos || usuario,
      email: usuarioEncontrado.email || null,
      activo: usuarioEncontrado.activo
    }
  };
}

  async verificarToken(token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      throw new Error('Token inválido');
    }
  }

  /**
   * Crear usuario (admin y coordinador)
   */
  async crearUsuario(usuarioData, adminId) {
    const { usuario, contrasena, tipo_usuario, nombre_apellidos, telefono, email, especialidad } = usuarioData;

    // Verificar que quien crea sea admin o coordinador
    const admin = await Usuario.findByPk(adminId);
    if (!admin || !['admin', 'coordinador'].includes(admin.tipo_usuario)) {
      throw new Error('Solo los administradores y coordinadores pueden crear usuarios');
    }

    // Verificar si el usuario ya existe
    const existeUsuario = await Usuario.findOne({ where: { usuario } });
    if (existeUsuario) {
      throw new Error('El usuario ya existe');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Si es un rol de brigada, crear primero el integrante
    let id_integrante = null;
    if (['jefe_brigada', 'botanico', 'tecnico_auxiliar', 'coinvestigador', 'laboratorio', 'coordinador'].includes(tipo_usuario)) {
      const { sequelize } = require('../config/database');
      
      const [result] = await sequelize.query(`
        INSERT INTO integrante (nombre_apellidos, rol, telefono, email, especialidad)
        VALUES (:nombre_apellidos, :rol, :telefono, :email, :especialidad)
        RETURNING id
      `, {
        replacements: {
          nombre_apellidos: nombre_apellidos || usuario,
          rol: tipo_usuario,
          telefono: telefono || null,
          email: email || null,
          especialidad: especialidad || null
        }
      });
      
      id_integrante = result[0].id;
    }

    // Crear usuario
    const nuevoUsuario = await Usuario.create({
      usuario,
      contraseña: hashedPassword,
      tipo_usuario,
      id_integrante
    });

    return {
      id: nuevoUsuario.id,
      usuario: nuevoUsuario.usuario,
      tipo_usuario: nuevoUsuario.tipo_usuario,
      id_integrante
    };
  }

  /**
   * Listar todos los usuarios (admin y coordinador)
   */
  async listarUsuarios(adminId) {
    const admin = await Usuario.findByPk(adminId);
    if (!admin || !['admin', 'coordinador'].includes(admin.tipo_usuario)) {
      throw new Error('Solo los administradores y coordinadores pueden listar usuarios');
    }

    const { sequelize } = require('../config/database');
    
    const usuarios = await sequelize.query(`
      SELECT 
        u.id,
        u.usuario,
        u.tipo_usuario,
        u.activo,
        u.fecha_creacion,
        i.nombre_apellidos,
        i.telefono,
        i.email,
        i.especialidad
      FROM usuarios u
      LEFT JOIN integrante i ON u.id_integrante = i.id
      ORDER BY u.id DESC
    `, {
      type: sequelize.QueryTypes.SELECT
    });

    return usuarios;
  }

  /**
   * Eliminar usuario (admin y coordinador)
   */
  async eliminarUsuario(userId, adminId) {
    const admin = await Usuario.findByPk(adminId);
    if (!admin || !['admin', 'coordinador'].includes(admin.tipo_usuario)) {
      throw new Error('Solo los administradores y coordinadores pueden eliminar usuarios');
    }

    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    if (usuario.tipo_usuario === 'admin') {
      throw new Error('No se puede eliminar un usuario administrador');
    }

    await usuario.destroy();
    return { message: 'Usuario eliminado exitosamente' };
  }

  /**
   * Obtener estadísticas de usuarios
   */
  async obtenerEstadisticas() {
    try {
      const total = await Usuario.count();
      
      // Contar por tipo de usuario
      const porTipo = await sequelize.query(`
        SELECT tipo_usuario, COUNT(*) as cantidad
        FROM usuarios
        GROUP BY tipo_usuario
      `, {
        type: sequelize.QueryTypes.SELECT
      });
      
      const stats = {
        total: total,
        por_tipo: {}
      };
      
      porTipo.forEach(t => {
        stats.por_tipo[t.tipo_usuario] = parseInt(t.cantidad);
      });
      
      return stats;
    } catch (error) {
      throw new Error('Error al obtener estadísticas: ' + error.message);
    }
  }

  /**
   * Editar usuario (admin y coordinador)
   */
  async editarUsuario(userId, usuarioData, adminId) {
    const admin = await Usuario.findByPk(adminId);
    if (!admin || !['admin', 'coordinador'].includes(admin.tipo_usuario)) {
      throw new Error('Solo los administradores y coordinadores pueden editar usuarios');
    }

    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    const { usuario: nuevoUsuario, nombre_apellidos, telefono, email, especialidad, contrasena } = usuarioData;

    // Si se quiere cambiar el nombre de usuario, verificar que no exista otro con ese nombre
    if (nuevoUsuario && nuevoUsuario !== usuario.usuario) {
      const existeUsuario = await Usuario.findOne({ where: { usuario: nuevoUsuario } });
      if (existeUsuario) {
        throw new Error('El nombre de usuario ya existe');
      }
      usuario.usuario = nuevoUsuario;
    }

    // Si el usuario tiene integrante asociado, actualizar sus datos
    if (usuario.id_integrante) {
      await sequelize.query(`
        UPDATE integrante
        SET nombre_apellidos = :nombre_apellidos,
            telefono = :telefono,
            email = :email,
            especialidad = :especialidad
        WHERE id = :id_integrante
      `, {
        replacements: {
          nombre_apellidos: nombre_apellidos || null,
          telefono: telefono || null,
          email: email || null,
          especialidad: especialidad || null,
          id_integrante: usuario.id_integrante
        }
      });
    }

    // Si se proporciona nueva contraseña, actualizarla
    if (contrasena) {
      const hashedPassword = await bcrypt.hash(contrasena, 10);
      usuario.contraseña = hashedPassword;
    }

    await usuario.save();

    return {
      id: usuario.id,
      usuario: usuario.usuario,
      tipo_usuario: usuario.tipo_usuario,
      message: 'Usuario actualizado exitosamente'
    };
  }

  /**
   * Desactivar/Activar usuario (admin y coordinador)
   */
  async toggleActivarUsuario(userId, adminId) {
    const admin = await Usuario.findByPk(adminId);
    if (!admin || !['admin', 'coordinador'].includes(admin.tipo_usuario)) {
      throw new Error('Solo los administradores y coordinadores pueden desactivar usuarios');
    }

    const usuario = await Usuario.findByPk(userId);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    if (usuario.tipo_usuario === 'admin') {
      throw new Error('No se puede desactivar un usuario administrador');
    }

    // Cambiar el estado activo
    usuario.activo = !usuario.activo;
    await usuario.save();

    return {
      id: usuario.id,
      activo: usuario.activo,
      message: `Usuario ${usuario.activo ? 'activado' : 'desactivado'} exitosamente`
    };
  }

  /**
   * Cambiar contraseña de usuario autenticado
   */
  async cambiarContrasena(idUsuario, contrasenaActual, contrasenaNueva) {
    const usuario = await Usuario.findByPk(idUsuario);

    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const esValida = await bcrypt.compare(contrasenaActual, usuario.contraseña);
    if (!esValida) {
      throw new Error('La contraseña actual es incorrecta');
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(contrasenaNueva, 10);

    // Actualizar contraseña
    usuario.contraseña = hashedPassword;
    await usuario.save();

    return {
      message: 'Contraseña actualizada exitosamente'
    };
  }

  /**
   * Restablecer contraseña (admin y coordinador)
   */
  async restablecerContrasena(idUsuario, nuevaContrasena, idAdmin) {
    const admin = await Usuario.findByPk(idAdmin);
    if (!admin || !['admin', 'coordinador'].includes(admin.tipo_usuario)) {
      throw new Error('No tienes permisos para restablecer contraseñas');
    }

    const usuario = await Usuario.findByPk(idUsuario);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Encriptar nueva contraseña
    const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

    // Actualizar contraseña
    usuario.contraseña = hashedPassword;
    await usuario.save();

    return {
      message: 'Contraseña restablecida exitosamente'
    };
  }

  /**
   * Obtener perfil de usuario
   */
  async obtenerPerfil(idUsuario) {
    const usuarios = await sequelize.query(`
      SELECT u.id, u.usuario, u.tipo_usuario, u.activo, u.fecha_creacion,
             i.nombre_apellidos, i.email, i.telefono, i.especialidad
      FROM usuarios u
      LEFT JOIN integrante i ON u.id_integrante = i.id
      WHERE u.id = :idUsuario
      LIMIT 1
    `, {
      replacements: { idUsuario },
      type: sequelize.QueryTypes.SELECT
    });

    if (!usuarios || usuarios.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    return usuarios[0];
  }
}

module.exports = new AuthService();
