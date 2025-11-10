import { AlertCircle } from 'lucide-react';
import { useUsuario } from '../../context/UsuarioContext';

function BannerUsuarioInactivo() {
  const { esUsuarioActivo } = useUsuario();

  if (esUsuarioActivo) return null;

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex items-center">
        <AlertCircle className="text-yellow-400 mr-3" size={24} />
        <div>
          <p className="font-semibold text-yellow-800">
            Cuenta Desactivada - Modo Solo Lectura
          </p>
          <p className="text-sm text-yellow-700">
            Tu cuenta está inactiva. Puedes visualizar información pero no realizar modificaciones.
            Contacta al administrador para reactivar tu cuenta.
          </p>
        </div>
      </div>
    </div>
  );
}

export default BannerUsuarioInactivo;
