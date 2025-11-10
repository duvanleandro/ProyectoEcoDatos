import { createContext, useContext, useState, useEffect } from 'react';

const UsuarioContext = createContext();

export function UsuarioProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [esUsuarioActivo, setEsUsuarioActivo] = useState(true);

  useEffect(() => {
    // Cargar usuario del localStorage al inicio
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const usuarioData = JSON.parse(usuarioGuardado);
        setUsuario(usuarioData);
        setEsUsuarioActivo(usuarioData.activo !== false);
      } catch (error) {
        console.error('Error al parsear usuario:', error);
      }
    }
  }, []);

  const actualizarUsuario = (nuevoUsuario) => {
    setUsuario(nuevoUsuario);
    setEsUsuarioActivo(nuevoUsuario?.activo !== false);
    if (nuevoUsuario) {
      localStorage.setItem('usuario', JSON.stringify(nuevoUsuario));
    } else {
      localStorage.removeItem('usuario');
    }
  };

  const cerrarSesion = () => {
    setUsuario(null);
    setEsUsuarioActivo(true);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  return (
    <UsuarioContext.Provider value={{
      usuario,
      esUsuarioActivo,
      actualizarUsuario,
      cerrarSesion
    }}>
      {children}
    </UsuarioContext.Provider>
  );
}

export function useUsuario() {
  const context = useContext(UsuarioContext);
  if (!context) {
    throw new Error('useUsuario debe usarse dentro de UsuarioProvider');
  }
  return context;
}
