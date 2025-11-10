import { useUsuario } from '../context/UsuarioContext';

/**
 * Hook personalizado para verificar si el usuario está activo
 * y proporcionar utilidades para deshabilitar elementos
 */
export function useUsuarioActivo() {
  const { esUsuarioActivo, usuario } = useUsuario();

  /**
   * Props para deshabilitar inputs/botones si el usuario está inactivo
   */
  const propsDeshabilitado = {
    disabled: !esUsuarioActivo,
    className: !esUsuarioActivo ? 'opacity-50 cursor-not-allowed' : ''
  };

  /**
   * Función para ejecutar una acción solo si el usuario está activo
   */
  const ejecutarSiActivo = (callback) => {
    return (...args) => {
      if (!esUsuarioActivo) {
        alert('⚠️ Tu cuenta está desactivada. No puedes realizar modificaciones.');
        return;
      }
      return callback(...args);
    };
  };

  return {
    esUsuarioActivo,
    usuario,
    propsDeshabilitado,
    ejecutarSiActivo
  };
}
