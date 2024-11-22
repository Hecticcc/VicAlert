import { Location } from '../types/incident';

// Victoria region boundaries
const VICGRID = {
  ORIGIN_LAT: -37.813628,
  ORIGIN_LNG: 144.963058,
  
  bounds: {
    minLat: -39.2,
    maxLat: -34.0,
    minLng: 140.9,
    maxLng: 150.0
  }
};

const STREET_COORDINATES: Record<string, [number, number]> = {
  'DOBIES CT WESTMEADOWS': [-37.6725, 144.8805],
  'GRANTHAM DR HIGHTON': [-38.1845, 144.3155],
  'HUME HWY CRAIGIEBURN': [-37.5997, 144.9445],
  'HAMILTON HWY MURGHEBOLUC': [-38.1512, 144.1645]
};

const LOCATION_COORDINATES: Record<string, [number, number]> = {
  'WESTMEADOWS': [-37.6747, 144.8811],
  'HIGHTON': [-38.1833, 144.3167],
  'CRAIGIEBURN': [-37.6000, 144.9500],
  'MURGHEBOLUC': [-38.1500, 144.1667]
};

const geocodeCache = new Map<string, [number, number]>();

function normalizeAddress(address: string): string {
  return address
    .toUpperCase()
    .replace(/\s+/g, ' ')
    .replace(/\([^)]*\)/g, '')
    .trim();
}

export function geocodeAddress(location: Location): [number, number] | null {
  try {
    const cacheKey = `${location.address}${location.crossStreet || ''}`;
    
    if (geocodeCache.has(cacheKey)) {
      return geocodeCache.get(cacheKey)!;
    }

    const normalized = normalizeAddress(location.address);
    
    // Check exact street matches first
    for (const [street, coords] of Object.entries(STREET_COORDINATES)) {
      if (normalized.includes(street)) {
        geocodeCache.set(cacheKey, coords);
        return coords;
      }
    }

    // Check location matches
    for (const [loc, coords] of Object.entries(LOCATION_COORDINATES)) {
      if (normalized.includes(loc)) {
        geocodeCache.set(cacheKey, coords);
        return coords;
      }
    }

    // Default to Melbourne CBD if no match found
    const defaultCoords: [number, number] = [VICGRID.ORIGIN_LAT, VICGRID.ORIGIN_LNG];
    geocodeCache.set(cacheKey, defaultCoords);
    return defaultCoords;

  } catch (error) {
    console.error('Error geocoding address:', error);
    return null;
  }
}