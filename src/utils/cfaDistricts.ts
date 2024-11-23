// Map of brigade codes to their district numbers
export const CFA_DISTRICTS: Record<string, number> = {
    // FRV Stations (Metropolitan Fire District)
    'P01': 14, // Eastern Hill
    'P02': 14, // West Melbourne
    'P03': 14, // Carlton
    'P04': 14, // Brunswick
    'P05': 14, // Broadmeadows
    'P06': 14, // Pascoe Vale
    'P07': 14, // Thomastown
    'P09': 14, // Somerton
    'P10': 14, // Richmond
    'P11': 14, // Epping
    'P12': 14, // Preston
    'P13': 14, // Northcote
    'P14': 14, // Bundoora
    'P15': 14, // Heidelberg
    'P16': 14, // Greensborough
    'P18': 14, // Hawthorn
    'P19': 14, // North Balwyn
    'P20': 13, // Box Hill
    'P22': 13, // Ringwood
    'P23': 13, // Burwood
    'P24': 13, // Glen Iris
    'P25': 13, // Oakleigh
    'P26': 13, // Croydon
    'P27': 13, // Nunawading
    'P28': 13, // Vermont South
    'P29': 8,  // Clayton
    'P30': 13, // Templestowe
    'P31': 13, // Glen Waverley
    'P32': 8,  // Ormond
    'P33': 8,  // Mentone
    'P34': 8,  // Highett
    'P35': 8,  // Windsor
    'P38': 14, // South Melbourne
    'P39': 14, // Port Melbourne
    'P40': 14, // Laverton
    'P41': 14, // St Albans
    'P42': 14, // Newport
    'P43': 14, // Deer Park
    'P44': 14, // Sunshine
    'P45': 14, // Brooklyn
    'P46': 14, // Altona
    'P47': 14, // Footscray
    'P48': 14, // Taylors Lakes
    'P51': 14, // Keilor
    'P52': 14, // Tullamarine
    'P53': 14, // Sunbury
    'P54': 14, // Greenvale
    'P55': 14, // Caroline Springs
    'P56': 14, // Melton
    'P57': 14, // Tarneit
    'P58': 14, // Point Cook
    'P59': 14, // Derrimut
    'P61': 7,  // Lara
    'P62': 7,  // Corio
    'P63': 7,  // Geelong City
    'P63B': 7, // Geelong City
    'P64': 7,  // Belmont
    'P66': 7,  // Ocean Grove
    'P67': 15, // Ballarat City
    'P67B': 15, // Ballarat City
    'P68': 15, // Lucas
    'P70': 4,  // Warrnambool
    'P71': 4,  // Portland
    'P72': 18, // Mildura
    'P73': 2,  // Bendigo
    'P74': 23, // Wangaratta
    'P75': 22, // Shepparton
    'P76': 24, // Wodonga
    'P77': 27, // Traralgon
    'P78': 27, // Morwell
    'P79': 27, // Latrobe West
    'P80': 14, // Craigieburn
    'P81': 14, // South Morang
    'P82': 14, // Eltham
    'P84': 13, // South Warrandyte
    'P85': 13, // Boronia
    'P86': 13, // Rowville
    'P87': 8,  // Dandenong
    'P88': 8,  // Hallam
    'P89': 8,  // Springvale
    'P90': 8,  // Patterson River
    'P91': 8,  // Frankston
    'P91A': 8, // Frankston
    'P91B': 8, // Frankston
    'P92': 8,  // Cranbourne
    'P93': 8,  // Pakenham
    'P94': 8,  // Mornington
    'P95': 8,  // Rosebud
  
    // FS prefix variants (same districts as P prefix)
    'FS01': 14, 'FS02': 14, 'FS03': 14, 'FS04': 14, 'FS05': 14,
    'FS06': 14, 'FS07': 14, 'FS09': 14, 'FS10': 14, 'FS11': 14,
    'FS12': 14, 'FS13': 14, 'FS14': 14, 'FS15': 14, 'FS16': 14,
    'FS18': 14, 'FS19': 14, 'FS20': 13, 'FS22': 13, 'FS23': 13,
    'FS24': 13, 'FS25': 13, 'FS26': 13, 'FS27': 13, 'FS28': 13,
    'FS29': 8, 'FS30': 13, 'FS31': 13, 'FS32': 8, 'FS33': 8,
    'FS34': 8, 'FS35': 8, 'FS38': 14, 'FS39': 14, 'FS40': 14,
    'FS41': 14, 'FS42': 14, 'FS43': 14, 'FS44': 14, 'FS45': 14,
    'FS46': 14, 'FS47': 14, 'FS48': 14, 'FS51': 14, 'FS52': 14,
    'FS53': 14, 'FS54': 14, 'FS55': 14, 'FS56': 14, 'FS57': 14,
    'FS58': 14, 'FS59': 14, 'FS61': 7, 'FS62': 7, 'FS63': 7,
    'FS63B': 7, 'FS64': 7, 'FS66': 7, 'FS67': 15, 'FS67B': 15,
    'FS68': 15, 'FS70': 4, 'FS71': 4, 'FS72': 18, 'FS73': 2,
    'FS74': 23, 'FS75': 22, 'FS76': 24, 'FS77': 27, 'FS78': 27,
    'FS79': 27, 'FS80': 14, 'FS81': 14, 'FS82': 14, 'FS84': 13,
    'FS85': 13, 'FS86': 13, 'FS87': 8, 'FS88': 8, 'FS89': 8,
    'FS90': 8, 'FS91': 8, 'FS91A': 8, 'FS91B': 8, 'FS92': 8,
    'FS93': 8, 'FS94': 8, 'FS95': 8,
  
    // Specialized Units
    'R3': 14,  // Rescue Carlton
    'R7': 14,  // Rescue Carlton
    'TB10': 14, // Teleboom Richmond
    'BA38': 14, // BA Support South Melbourne
    'HZ88': 8,  // Hazmat Hallam
    'PT14': 14, // Pumper Tanker Bundoora
    'LP87': 8,  // Ladder Platform Dandenong
    'PT9': 14,  // Pumper Tanker Somerton
    'PT31': 13, // Pumper Tanker Glen Waverley
    'BA1': 14,  // BA Support Eastern Hill
    'PH1': 14,  // Platform Hydraulic Eastern Hill
    'R1': 14,   // Rescue Eastern Hill
    'R2': 14,   // Rescue West Melbourne
    'R38': 14,  // Rescue South Melbourne
    'R87': 8,   // Rescue Dandenong
    'HZ1': 14,  // Hazmat Eastern Hill
    'TB38': 14, // Teleboom South Melbourne
    'TB87': 8,  // Teleboom Dandenong
    'LP1': 14,  // Ladder Platform Eastern Hill
    'LP38': 14, // Ladder Platform South Melbourne
  
    // CFA Stations
    'TOOM': 8,  // Toomuc
    'CADW': 8,  // Carrum Downs
    'ARAU': 16, // Ararat
    'DORE': 14, // Doreen
    'MERN': 14, // Mernda
    'HADD': 15, // Haddon
    'CARL': 2,  // Carlsruhe
    'KYNE': 2,  // Kyneton
    'NEWH': 2,  // Newham
    'MALM': 2,  // Malmsbury
    'PAST': 2,  // Pastoria
    'TYLD': 2,  // Tylden
    'GMER': 23, // Glenroy & Merrijig
    'MANU': 23, // Mansfield
    'KOOW': 8,  // Koo Wee Rup
    'LANG': 8,  // Lang Lang
    'WONG': 13, // Wonga Park
    'STHW': 13, // South Warrandyte
    'DARR': 14, // Darraweit Guim
    'BOLI': 14, // Bolinda & Monegetta
    'CBRN': 14, // Craigieburn
    'WALN': 7,  // Wallington
    'LEOP': 7,  // Leopold
    'DRY': 7    // Drysdale
  };
  
  export function getDistrictFromCode(code: string): number | undefined {
    // Handle numeric codes (FRV stations)
    if (/^\d+$/.test(code)) {
      return CFA_DISTRICTS[`P${code.padStart(2, '0')}`];
    }
  
    // Handle P and FS prefixes
    if (code.startsWith('P') || code.startsWith('FS')) {
      const baseCode = code.replace(/^(P|FS)/, '').split(/[A-Z]/)[0];
      const paddedCode = baseCode.padStart(2, '0');
      return CFA_DISTRICTS[`P${paddedCode}`] || CFA_DISTRICTS[code];
    }
  
    // Try direct lookup first
    let district = CFA_DISTRICTS[code];
    if (district) return district;
  
    // Try without numbers and special characters
    const cleanCode = code.replace(/[0-9\[\]_]/g, '');
    return CFA_DISTRICTS[cleanCode];
  }