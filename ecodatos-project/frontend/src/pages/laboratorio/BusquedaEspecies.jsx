import { useState } from 'react';
import { Search, Loader, AlertCircle, ExternalLink, Info } from 'lucide-react';
import Layout from '../../components/common/Layout';

function BusquedaEspecies() {
  const [termino, setTermino] = useState('');
  const [resultados, setResultados] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const buscarEspecie = async () => {
    if (!termino.trim()) {
      setError('Por favor ingresa un término de búsqueda');
      return;
    }

    setCargando(true);
    setError(null);
    setResultados(null);

    try {
      // Búsqueda en Wikipedia en español
      const searchUrl = `https://es.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(termino)}&limit=5&namespace=0&format=json&origin=*`;

      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (searchData[1].length === 0) {
        setError('No se encontraron resultados. Intenta con otro término.');
        setCargando(false);
        return;
      }

      // Tomar el primer resultado
      const titulo = searchData[1][0];
      const descripcion = searchData[2][0];
      const urlWikipedia = searchData[3][0];

      // Obtener información detallada y imagen
      const detalleUrl = `https://es.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(titulo)}&prop=extracts|pageimages|categories&exintro=true&explaintext=true&piprop=original&format=json&origin=*`;

      const detalleResponse = await fetch(detalleUrl);
      const detalleData = await detalleResponse.json();

      const pages = detalleData.query.pages;
      const pageId = Object.keys(pages)[0];
      const pageData = pages[pageId];

      // Buscar categorías relacionadas con biología
      const categorias = pageData.categories || [];
      const categoriasRelevantes = categorias
        .filter(cat =>
          cat.title.toLowerCase().includes('flora') ||
          cat.title.toLowerCase().includes('fauna') ||
          cat.title.toLowerCase().includes('especie') ||
          cat.title.toLowerCase().includes('planta') ||
          cat.title.toLowerCase().includes('animal')
        )
        .map(cat => cat.title.replace('Categoría:', ''));

      setResultados({
        titulo: pageData.title,
        extracto: pageData.extract || descripcion || 'No hay descripción disponible.',
        imagen: pageData.original?.source || null,
        urlWikipedia: urlWikipedia,
        categorias: categoriasRelevantes
      });

    } catch (err) {
      console.error('Error al buscar:', err);
      setError('Error al conectar con el servicio de búsqueda. Intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      buscarEspecie();
    }
  };

  const limpiarBusqueda = () => {
    setTermino('');
    setResultados(null);
    setError(null);
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Search className="text-purple-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">Búsqueda de Especies</h1>
          </div>
          <p className="text-gray-600">
            Busca información detallada de especies por nombre científico, nombre común o familia.
            Los datos se obtienen de Wikipedia.
          </p>
        </div>

        {/* Barra de búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="text"
                value={termino}
                onChange={(e) => setTermino(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ej: Quercus humboldtii, Roble, Fagaceae..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                disabled={cargando}
              />
            </div>
            <button
              onClick={buscarEspecie}
              disabled={cargando}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cargando ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Buscando...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Buscar
                </>
              )}
            </button>
            {(resultados || error) && (
              <button
                onClick={limpiarBusqueda}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg transition"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Info adicional */}
          <div className="mt-4 flex items-start gap-2 text-sm text-gray-600 bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
            <Info size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <p>
              <strong>Consejo:</strong> Para mejores resultados, usa nombres científicos
              (ej: "Quercus humboldtii") o nombres comunes específicos.
              Puedes buscar especies de flora y fauna.
            </p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="text-red-400" size={24} />
              <div>
                <p className="font-semibold text-red-800">Error</p>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Resultados */}
        {resultados && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header del resultado */}
            <div className="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-6">
              <h2 className="text-2xl font-bold mb-2">{resultados.titulo}</h2>
              <a
                href={resultados.urlWikipedia}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-purple-200 hover:text-white transition"
              >
                <ExternalLink size={18} />
                Ver en Wikipedia
              </a>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Columna de imagen */}
                <div className="md:col-span-1">
                  {resultados.imagen ? (
                    <div className="rounded-lg overflow-hidden shadow-lg border border-gray-200">
                      <img
                        src={resultados.imagen}
                        alt={resultados.titulo}
                        className="w-full h-auto object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
                        }}
                      />
                    </div>
                  ) : (
                    <div className="bg-gray-100 rounded-lg p-8 text-center border-2 border-dashed border-gray-300">
                      <AlertCircle className="mx-auto text-gray-400 mb-2" size={48} />
                      <p className="text-gray-500">
                        Imagen no disponible
                      </p>
                    </div>
                  )}
                </div>

                {/* Columna de información */}
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Información
                  </h3>

                  <div className="prose max-w-none text-gray-700 leading-relaxed mb-6">
                    <p className="text-justify">
                      {resultados.extracto}
                    </p>
                  </div>

                  {/* Categorías */}
                  {resultados.categorias.length > 0 && (
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                        <Info size={18} className="text-purple-600" />
                        Categorías Relacionadas
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {resultados.categorias.map((categoria, index) => (
                          <span
                            key={index}
                            className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm border border-purple-300"
                          >
                            {categoria}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Botón de nueva búsqueda */}
                  <div className="mt-6 flex gap-3">
                    <a
                      href={resultados.urlWikipedia}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                      <ExternalLink size={18} />
                      Ver artículo completo
                    </a>
                    <button
                      onClick={limpiarBusqueda}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg transition"
                    >
                      Nueva búsqueda
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Estado inicial */}
        {!resultados && !error && !cargando && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <Search className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Comienza tu búsqueda
            </h3>
            <p className="text-gray-500">
              Ingresa el nombre de una especie para obtener información detallada
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default BusquedaEspecies;
