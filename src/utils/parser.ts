import { Incident } from '../types/incident';
import { getDistrictFromCode } from './cfaDistricts';

// Alert type patterns with priorities
const ALERT_PATTERNS: Record<string, string> = {
  'NOSTC': 'Non-Structure Fire',
  'STRUC': 'Structure Fire',
  'G&SC': 'Grass & Scrub Fire',
  'RESCC': 'Rescue',
  'ALARC': 'Alarm',
  'ALARM': 'Alarm',
  'INCIC': 'Incident',
  'HIARC': 'High Angle Rescue',
  'UN': 'Unknown',
  'SF': 'Structure Fire',
  'NSTH': 'Structure Fire',
  'WHITE': 'White Page',
  'UNDET': 'Under Determination',
  'MOVE': 'Station Movement'
};

// Excluded codes that should not appear in station lists
const EXCLUDED_CODES = new Set([
  'AFPR', 'FP', 'AFEMR', 'EMRR11', 'EMRR13', 'FAFSCC', 'AFPEMR',
  'FGD', 'AFP', 'FA', 'E24112111103', 'OAT', 'ORO', 'AFPS', 'RKE',
  'AIRSWL', 'BDG372', 'BOM356', 'BOM357', 'WBEER', 'GEEFC', 'AIRSEA',
  'WENOFO', 'EMR', 'EMERG'
]);

// EMR related keywords to filter out incidents
const EMR_KEYWORDS = [
  'emr',
  'emergency medical response',
  'medical emergency',
  'afemr',
  'emrr',
  'medical incident'
];

function shouldFilterIncident(text: string): boolean {
  const lowerText = text.toLowerCase();
  return EMR_KEYWORDS.some(keyword => lowerText.includes(keyword));
}

function isStationMovement(text: string): boolean {
  return /@@ALERT\s+(?:P\d+[A-Z]?)\s+MOVE\s+TO\s+STATION/i.test(text);
}

function cleanHtmlTags(text: string): string {
  return text
    .replace(/<[^>]+>/g, '')
    .replace(/&[a-zA-Z]+;/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function determineAlertType(text: string): { alertCode: string; alertType: string } {
  if (isStationMovement(text)) {
    const match = text.match(/@@ALERT\s+(P\d+[A-Z]?)/);
    return {
      alertCode: match?.[1] || 'MOVE',
      alertType: 'Station Movement'
    };
  }

  const alertMatch = text.match(/@@ALERT\s+(?:[A-Z0-9]+\s+)?([A-Z&]+)(\d[A-Z]?)/);
  if (!alertMatch) {
    return { alertCode: 'UNKNOWN', alertType: 'Unknown Incident' };
  }
  
  const [, typeCode, priority] = alertMatch;
  
  return {
    alertCode: `${typeCode}${priority}`,
    alertType: ALERT_PATTERNS[typeCode] || typeCode
  };
}

function extractDescription(text: string): string {
  const cleanText = cleanHtmlTags(text);
  
  if (isStationMovement(cleanText)) {
    const match = cleanText.match(/@@ALERT\s+(P\d+[A-Z]?)\s+MOVE\s+TO\s+STATION\s+(?:FS)?(\d+)/i);
    if (match) {
      const [, fromStation, toStation] = match;
      return `${fromStation.replace(/^P/, 'Station ')} moving to Station ${toStation}`;
    }
  }

  const match = cleanText.match(/@@ALERT.*?\s+(?:[A-Z0-9]+\s+)?(?:[A-Z&]+\d[A-Z]?\s+)(?:\*\s+)?([^0-9]+?)(?=\s+\d+)/);
  return match ? match[1].trim() : '';
}

function parseLocation(text: string): { name: string; address: string; crossStreet?: string } {
  const cleanText = cleanHtmlTags(text);

  if (isStationMovement(text)) {
    return {
      name: 'Station Movement',
      address: 'Station Movement'
    };
  }

  const locationPattern = /(?:[A-Z0-9]+\s+)?(?:[A-Z&]+\d[A-Z]?\s+)(?:\*\s+)?.*?(\d+[^/]+)(?:\/(.+?))?(?=\s+(?:M|G|SVC|SVSE)\s*\d+)/;
  const match = cleanText.match(locationPattern);
  
  if (!match) return { name: 'Unknown Location', address: 'Unknown Location' };
  
  const [, mainAddress, crossStreets] = match;
  
  const crossStreetParts = crossStreets
    ? crossStreets
        .split(/\//)
        .map(s => s.trim())
        .filter(s => s && !s.match(/^(?:M|G|SVC|SVSE)\d+/))
        .join(' & ')
        .replace(/\/\//g, '')
        .trim()
    : undefined;
  
  return {
    name: mainAddress.trim(),
    address: mainAddress.trim(),
    crossStreet: crossStreetParts || undefined
  };
}

function extractStationsFromLine(line: string): string[] {
  const stationPattern = /(?:(?:M|G|SVC|SVSE)\s*\d+.*?)([A-Z\s\[\]_0-9]+)(?=\s+F24|$)/;
  const match = line.match(stationPattern);
  
  if (!match) return [];
  
  const stationCodes = match[1].match(/(?:C?[A-Z]+\d*[A-Z]*|\[FS\d+_\]|\[[A-Z]+\]|P\d+[A-Z]?)/g) || [];
  
  return stationCodes
    .map(code => {
      if (code.startsWith('[FS')) {
        const fsMatch = code.match(/\[FS(\d+)_\]/);
        if (fsMatch) return `P${fsMatch[1]}`;
      }
      if (code.startsWith('[') && code.endsWith(']')) {
        return code.slice(1, -1).replace(/^C/, '');
      }
      if (code.startsWith('P')) return code;
      return code.replace(/^C/, '');
    })
    .filter(code => 
      code && 
      !EXCLUDED_CODES.has(code) &&
      !code.match(/^(?:F24\d+|M\d+|G\d+|\d+)$/) &&
      !code.match(/^[MG]\d+/) &&
      !code.match(/^F$/)
    );
}

function parseStations(text: string): { stations: string[]; stationDisplay: string; additionalStations: string[] } {
  if (isStationMovement(text)) {
    const match = text.match(/@@ALERT\s+(P\d+[A-Z]?)\s+MOVE\s+TO\s+STATION\s+(?:FS)?(\d+)/i);
    if (match) {
      const [, fromStation, toStation] = match;
      return {
        stations: [fromStation, `FS${toStation}`],
        stationDisplay: `${fromStation} → FS${toStation}`,
        additionalStations: []
      };
    }
  }

  const lines = text.split('\n').filter(line => line.includes('@@ALERT'));
  if (lines.length === 0) {
    return { stations: [], stationDisplay: '', additionalStations: [] };
  }

  const initialStations = new Set(extractStationsFromLine(lines[lines.length - 1]));
  const allStations = new Set(initialStations);
  const additionalStations: string[] = [];

  for (let i = lines.length - 2; i >= 0; i--) {
    const line = lines[i];
    const lineStations = extractStationsFromLine(line);

    lineStations.forEach(station => {
      if (!initialStations.has(station)) {
        additionalStations.push(station);
        allStations.add(station);
      }
    });
  }

  const uniqueStations = Array.from(allStations);
  const uniqueAdditional = Array.from(new Set(additionalStations));

  return {
    stations: uniqueStations,
    stationDisplay: uniqueStations.join(' & '),
    additionalStations: uniqueAdditional
  };
}

function determineSeverity(text: string, stationCount: number): Incident['severity'] {
  if (text.includes('FAFSCC') || text.includes('[FAFSCC]')) {
    return 'pending';
  }

  if (stationCount >= 31) return 'critical';
  if (stationCount >= 15) return 'extreme';
  if (stationCount >= 9) return 'high';
  if (stationCount >= 4) return 'medium';
  return 'low';
}

function determineTags(text: string): string[] {
  const tags: string[] = [];
  
  if (text.includes('AFEMR') || text.toLowerCase().includes('medical emergency')) {
    tags.push('medical');
  }
  
  return tags;
}

function determineDistrict(text: string): number | undefined {
  const brigadeMatch = text.match(/@@ALERT\s+([A-Z0-9]+)\s/);
  if (!brigadeMatch) return undefined;

  const code = brigadeMatch[1];

  if (/^\d+$/.test(code)) {
    const stationNumber = code.replace(/^0+/, '').slice(0, 2).padStart(2, '0');
    return getDistrictFromCode(`P${stationNumber}`);
  }

  let district = getDistrictFromCode(code);
  if (district) return district;

  const cleanCode = code.replace(/[0-9\[\]_]/g, '');
  district = getDistrictFromCode(cleanCode);
  if (district) return district;

  if (code.startsWith('P')) {
    district = getDistrictFromCode(`FS${code.slice(1)}`);
  } else if (code.startsWith('FS')) {
    district = getDistrictFromCode(`P${code.slice(2)}`);
  }

  return district;
}

export function parseIncidentData(text: string): Incident[] {
  if (!text) {
    console.warn('No incident text provided');
    return [];
  }

  const lines = text.split('\n')
    .filter(line => line.includes('@@ALERT'))
    .map(line => cleanHtmlTags(line));

  if (lines.length === 0) {
    console.warn('No alert lines found');
    return [];
  }

  const incidentGroups = new Map<string, string[]>();
  
  lines.forEach(line => {
    // Skip EMR alerts
    if (shouldFilterIncident(line)) {
      return;
    }

    if (isStationMovement(line)) {
      const timestamp = line.match(/^\d+\s+(\d{2}:\d{2}:\d{2})/)?.[1] || Date.now().toString();
      const ref = `MOVE_${timestamp.replace(/:/g, '')}`;
      incidentGroups.set(ref, [line]);
      return;
    }

    const refMatch = line.match(/F24\d+/);
    if (refMatch) {
      const ref = refMatch[0];
      const group = incidentGroups.get(ref) || [];
      group.push(line);
      incidentGroups.set(ref, group);
    }
  });

  return Array.from(incidentGroups.entries())
    .map(([reference, group]): Incident => {
      const mainLine = group
        .sort((a, b) => {
          const timeA = a.match(/\d{2}:\d{2}:\d{2}/)?.[0] || '';
          const timeB = b.match(/\d{2}:\d{2}:\d{2}/)?.[0] || '';
          return timeB.localeCompare(timeA);
        })[0];

      const { alertCode, alertType } = determineAlertType(mainLine);
      const description = extractDescription(mainLine);
      const location = parseLocation(mainLine);
      const { stations, stationDisplay, additionalStations } = parseStations(group.join('\n'));
      const tags = determineTags(mainLine);
      const district = determineDistrict(mainLine);
      const initialBrigadeMatch = mainLine.match(/@@ALERT\s+([A-Z0-9]+)\s/);
      const initialBrigade = initialBrigadeMatch ? initialBrigadeMatch[1] : undefined;

      const timestampMatch = mainLine.match(/(\d{2}:\d{2}:\d{2})\s+(\d{4}-\d{2}-\d{2})/);
      const timestamp = timestampMatch 
        ? new Date(`${timestampMatch[2]}T${timestampMatch[1]}`).toISOString()
        : new Date().toISOString();

      return {
        id: `${Date.now()}-${Math.random()}`,
        stationId: stations[0] || 'UNKNOWN',
        stations,
        additionalStations,
        alertCode,
        alertType,
        title: description || alertType,
        location,
        coordinates: [0, 0],
        timestamp,
        status: 'active',
        severity: determineSeverity(mainLine, stations.length),
        description,
        reference: reference.startsWith('MOVE_') ? undefined : reference,
        stationDisplay,
        rawText: group.join('\n'),
        hasUpdate: group.length > 1,
        tags,
        district,
        initialBrigade
      };
    });
}