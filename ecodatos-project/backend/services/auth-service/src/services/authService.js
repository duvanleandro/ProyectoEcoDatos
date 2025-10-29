const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

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
    // Buscar usuario
    const usuarioEncontrado = await Usuario.findOne({ 
      where: { usuario, activo: true } 
    });

    if (!usuarioEncontrado) {
      throw new Error('Credenciales inválidas');
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
        tipo_usuario: usuarioEncontrado.tipo_usuario
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
   * Crear usuario (solo admin)
   */
  async crearUsuario(usuarioData, adminId) {
    const { usuario, contrasena, tipo_usuario, nombre_apellidos, rol, telefono, email, especialidad } = usuarioData;

    // Verificar que quien crea sea admin
    const admin = await Usuario.findByPk(adminId);
    if (!admin || admin.tipo_usuario !== 'admin') {
      throw new Error('Solo los administradores pueden crear usuarios');
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
    if (['jefe_brigada', 'botanico', 'tecnico_auxiliar', 'coinvestigador'].includes(tipo_usuario)) {
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
   * Listar todos los usuarios (solo admin)
   */
  async listarUsuarios(adminId) {
    const admin = await Usuario.findByPk(adminId);
    if (!admin || admin.tipo_usuario !== 'admin') {
      throw new Error('Solo los administradores pueden listar usuarios');
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
   * Eliminar usuario (solo admin)
   */
  async eliminarUsuario(userId, adminId) {
    const admin = await Usuario.findByPk(adminId);
    if (!admin || admin.tipo_usuario !== 'admin') {
      throw new Error('Solo los administradores pueden eliminar usuarios');
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
}

module.exports = new AuthService();
