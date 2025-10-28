/**
 * Utilidades para cálculos geográficos
 */

// Límites aproximados de Colombia (latitud, longitud)
const COLOMBIA_BOUNDS = {
  norte: 13.4,      // Punta Gallinas (La Guajira)
  sur: -4.2,        // Leticia (Amazonas)
  este: -66.8,      // Río Negro (frontera Brasil)
  oeste: -79.0      // Cabo Manglares (Nariño)
};

/**
 * Genera un punto aleatorio dentro de los límites de Colombia
 */
function generarPuntoAleatorio() {
  const lat = Math.random() * (COLOMBIA_BOUNDS.norte - COLOMBIA_BOUNDS.sur) + COLOMBIA_BOUNDS.sur;
  const lon = Math.random() * (COLOMBIA_BOUNDS.este - COLOMBIA_BOUNDS.oeste) + COLOMBIA_BOUNDS.oeste;
  
  return {
    latitud: parseFloat(lat.toFixed(8)),
    longitud: parseFloat(lon.toFixed(8))
  };
}

/**
 * Calcula un nuevo punto a una distancia y dirección específica
 * @param {number} lat - Latitud origen
 * @param {number} lon - Longitud origen
 * @param {number} distanciaMetros - Distancia en metros
 * @param {number} angulo - Ángulo en grados (0=Norte, 90=Este, 180=Sur, 270=Oeste)
 */
function calcularNuevoPunto(lat, lon, distanciaMetros, angulo) {
  const radioTierra = 6371000; // Radio de la Tierra en metros
  const anguloRad = (angulo * Math.PI) / 180;
  const distanciaRad = distanciaMetros / radioTierra;

  const latRad = (lat * Math.PI) / 180;
  const lonRad = (lon * Math.PI) / 180;

  const nuevaLatRad = Math.asin(
    Math.sin(latRad) * Math.cos(distanciaRad) +
    Math.cos(latRad) * Math.sin(distanciaRad) * Math.cos(anguloRad)
  );

  const nuevaLonRad = lonRad + Math.atan2(
    Math.sin(anguloRad) * Math.sin(distanciaRad) * Math.cos(latRad),
    Math.cos(distanciaRad) - Math.sin(latRad) * Math.sin(nuevaLatRad)
  );

  return {
    latitud: parseFloat(((nuevaLatRad * 180) / Math.PI).toFixed(8)),
    longitud: parseFloat(((nuevaLonRad * 180) / Math.PI).toFixed(8))
  };
}

/**
 * Calcula las 5 subparcelas de un conglomerado
 * @param {number} latCentro - Latitud del centro
 * @param {number} lonCentro - Longitud del centro
 */
function calcularSubparcelas(latCentro, lonCentro) {
  const distancia = 80; // 80 metros entre centros

  const subparcelas = [
    {
      numero: 1,
      nombre: 'SPF-1',
      latitud: latCentro,
      longitud: lonCentro,
      direccion: 'Centro'
    },
    {
      numero: 2,
      nombre: 'SPF-2',
      ...calcularNuevoPunto(latCentro, lonCentro, distancia, 0), // Norte
      direccion: 'Norte'
    },
    {
      numero: 3,
      nombre: 'SPF-3',
      ...calcularNuevoPunto(latCentro, lonCentro, distancia, 90), // Este
      direccion: 'Este'
    },
    {
      numero: 4,
      nombre: 'SPF-4',
      ...calcularNuevoPunto(latCentro, lonCentro, distancia, 180), // Sur
      direccion: 'Sur'
    },
    {
      numero: 5,
      nombre: 'SPF-5',
      ...calcularNuevoPunto(latCentro, lonCentro, distancia, 270), // Oeste
      direccion: 'Oeste'
    }
  ];

  return subparcelas.map(sp => ({
    ...sp,
    coordenadas: `${sp.latitud}, ${sp.longitud}`
  }));
}

module.exports = {
  generarPuntoAleatorio,
  calcularNuevoPunto,
  calcularSubparcelas,
  COLOMBIA_BOUNDS
};
