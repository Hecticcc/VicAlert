// Map of station codes to full names
export const STATION_NAMES: Record<string, string> = {
  // FRV Stations (both P and FS prefixes map to same names)
  'P45': 'FRV 45 (Brooklyn)',
  'FS45': 'FRV 45 (Brooklyn)',
  'P47': 'FRV 47 (Footscray)',
  'FS47': 'FRV 47 (Footscray)',
  // Add more station mappings as needed
};

export function getStationName(code: string): string {
  // Remove brackets and underscore if present
  const cleanCode = code.replace(/[\[\]_]/g, '');
  
  // Handle P-prefixed codes by checking both P and FS versions
  if (cleanCode.startsWith('P')) {
    return STATION_NAMES[cleanCode] || STATION_NAMES[`FS${cleanCode.slice(1)}`] || code;
  }

  // Handle tanker codes (T1, T2, etc.)
  const tankerMatch = cleanCode.match(/^([A-Z]{4})T[1-9]$/);
  if (tankerMatch) {
    const baseCode = tankerMatch[1];
    const baseName = STATION_NAMES[baseCode];
    if (baseName) {
      return `${baseName} ${cleanCode.slice(4)}`; // Append T1, T2, etc.
    }
  }
  
  return STATION_NAMES[cleanCode] || code;
}

export function formatStationCode(code: string): string {
  return code.replace(/[\[\]_]/g, '');
}