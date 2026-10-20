/**
 * Utility for converting between GeoJSON [longitude, latitude], Firestore map objects [{longitude, latitude}], and Leaflet [latitude, longitude]
 */

export function geoJsonToLeaflet(coords: any): Array<[number, number]> {
  if (!Array.isArray(coords)) return [];
  return coords.map((pt: any) => {
    if (Array.isArray(pt)) {
      // GeoJSON [longitude, latitude] -> Leaflet [latitude, longitude]
      return [Number(pt[1]) || 0, Number(pt[0]) || 0];
    }
    if (pt && typeof pt === 'object') {
      const lat = Number(pt.latitude ?? pt.lat) || 0;
      const lng = Number(pt.longitude ?? pt.lng) || 0;
      return [lat, lng];
    }
    return [0, 0];
  });
}

export function leafletToGeoJson(coords: any): Array<[number, number]> {
  if (!Array.isArray(coords)) return [];
  return coords.map((pt: any) => {
    if (Array.isArray(pt)) {
      return [Number(pt[1]) || 0, Number(pt[0]) || 0];
    }
    if (pt && typeof pt === 'object') {
      const lat = Number(pt.latitude ?? pt.lat) || 0;
      const lng = Number(pt.longitude ?? pt.lng) || 0;
      return [lng, lat];
    }
    return [0, 0];
  });
}

export function formatCoordinate(lat?: number | null, lng?: number | null): string {
  const safeLat = lat != null && !isNaN(Number(lat)) ? Number(lat).toFixed(4) : '0.0000';
  const safeLng = lng != null && !isNaN(Number(lng)) ? Number(lng).toFixed(4) : '0.0000';
  return `${safeLat}°, ${safeLng}°`;
}
