import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

/**
 * Hook para manejar paginación
 * @param {Array} data - Datos completos
 * @param {number} itemsPerPage - Items por página
 * @returns {Object} - Estado y funciones de paginación
 */
export function usePagination(data, itemsPerPage = 10) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil((data?.length || 0) / itemsPerPage);

  const paginatedData = useMemo(() => {
    if (!data) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    goToPage(currentPage + 1);
  };

  const previousPage = () => {
    goToPage(currentPage - 1);
  };

  const goToFirstPage = () => {
    goToPage(1);
  };

  const goToLastPage = () => {
    goToPage(totalPages);
  };

  const reset = () => {
    setCurrentPage(1);
  };

  return {
    currentPage,
    totalPages,
    itemsPerPage,
    paginatedData,
    goToPage,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    reset,
    hasNextPage: currentPage < totalPages,
    hasPreviousPage: currentPage > 1,
    totalItems: data?.length || 0,
    startIndex: (currentPage - 1) * itemsPerPage + 1,
    endIndex: Math.min(currentPage * itemsPerPage, data?.length || 0)
  };
}

/**
 * Componente de Paginación
 */
export function Pagination({ pagination, className = '' }) {
  const {
    currentPage,
    totalPages,
    goToPage,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    hasNextPage,
    hasPreviousPage,
    startIndex,
    endIndex,
    totalItems
  } = pagination;

  if (totalPages <= 1) return null;

  // Generar array de números de página para mostrar
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Mostrar todas las páginas si son pocas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Mostrar páginas alrededor de la actual
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      // Ajustar si estamos cerca del inicio o fin
      if (currentPage <= 3) {
        endPage = maxPagesToShow;
      }
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - maxPagesToShow + 1;
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      {/* Info */}
      <div className="text-sm text-gray-600">
        Mostrando <span className="font-semibold">{startIndex}</span> a{' '}
        <span className="font-semibold">{endIndex}</span> de{' '}
        <span className="font-semibold">{totalItems}</span> resultados
      </div>

      {/* Controles de paginación */}
      <div className="flex items-center gap-2">
        {/* Primera página */}
        <button
          onClick={goToFirstPage}
          disabled={!hasPreviousPage}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Primera página"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Página anterior */}
        <button
          onClick={previousPage}
          disabled={!hasPreviousPage}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Página anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Números de página */}
        <div className="flex gap-1">
          {pageNumbers[0] > 1 && (
            <>
              <button
                onClick={() => goToPage(1)}
                className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
              >
                1
              </button>
              {pageNumbers[0] > 2 && <span className="px-2 py-2 text-gray-500">...</span>}
            </>
          )}

          {pageNumbers.map(page => (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-2 rounded-lg border text-sm ${
                page === currentPage
                  ? 'bg-green-600 text-white border-green-600'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="px-2 py-2 text-gray-500">...</span>
              )}
              <button
                onClick={() => goToPage(totalPages)}
                className="px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm"
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        {/* Página siguiente */}
        <button
          onClick={nextPage}
          disabled={!hasNextPage}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Página siguiente"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Última página */}
        <button
          onClick={goToLastPage}
          disabled={!hasNextPage}
          className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          title="Última página"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * Selector de items por página
 */
export function ItemsPerPageSelector({ value, onChange, options = [10, 25, 50, 100], className = '' }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-600">Mostrar:</span>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <span className="text-sm text-gray-600">por página</span>
    </div>
  );
}

export default usePagination;
