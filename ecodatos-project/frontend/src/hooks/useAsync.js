import { useState, useCallback, useEffect } from 'react';

/**
 * Hook para manejar estados asíncronos de manera consistente
 * @param {Function} asyncFunction - Función asíncrona a ejecutar
 * @returns {Object} - Estado y funciones
 */
export function useAsync(asyncFunction) {
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...params) => {
      setStatus('loading');
      setData(null);
      setError(null);

      try {
        const response = await asyncFunction(...params);
        setData(response);
        setStatus('success');
        return response;
      } catch (error) {
        setError(error);
        setStatus('error');
        throw error;
      }
    },
    [asyncFunction]
  );

  const reset = useCallback(() => {
    setStatus('idle');
    setData(null);
    setError(null);
  }, []);

  return {
    execute,
    reset,
    status,
    data,
    error,
    isIdle: status === 'idle',
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error'
  };
}

/**
 * Hook para manejar carga de datos con auto-ejecución
 */
export function useAsyncData(asyncFunction, dependencies = []) {
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const reload = useCallback(async () => {
    setStatus('loading');
    setError(null);

    try {
      const response = await asyncFunction();
      setData(response);
      setStatus('success');
      return response;
    } catch (error) {
      setError(error);
      setStatus('error');
      throw error;
    }
  }, [asyncFunction]);

  // Auto-ejecutar al montar o cuando cambien las dependencias
  useEffect(() => {
    reload();
  }, dependencies);

  return {
    reload,
    status,
    data,
    error,
    isLoading: status === 'loading',
    isSuccess: status === 'success',
    isError: status === 'error'
  };
}

/**
 * Componente de Loading genérico
 */
export function LoadingSpinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div
        className={`${sizes[size]} border-4 border-gray-200 border-t-green-600 rounded-full animate-spin`}
      ></div>
    </div>
  );
}

/**
 * Componente de Error genérico
 */
export function ErrorMessage({ error, onRetry, className = '' }) {
  const message = error?.response?.data?.message || error?.message || 'Ha ocurrido un error';

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
      <div className="flex items-start">
        <div className="flex-1">
          <h3 className="text-red-800 font-semibold mb-1">Error</h3>
          <p className="text-red-700 text-sm">{message}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Reintentar
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Componente de Empty State genérico
 */
export function EmptyState({ title = 'No hay datos', description, icon, action, className = '' }) {
  return (
    <div className={`text-center py-12 ${className}`}>
      {icon && <div className="mb-4 flex justify-center text-gray-400">{icon}</div>}
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      {description && <p className="text-gray-500 mb-4">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default useAsync;
