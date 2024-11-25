import { parseIncidentData } from './parser.js';

// Test incident data
const testIncidents = [
  // Explosion incident
  `0567888	22:08:36 2024-11-18	@@ALERT NSTH1 STRUC1 EXPLOSION WITH FIRE TARAGO RESERVOIR PARK - NEERIM SOUTH TARAGO RESERVOIR RD NEERIM SOUTH /JINDIVICK-NEERIM SOUTH RD //JINDIVICK-NEERIM SOUTH RD SVSE 8572 A4 (069913) AFP CDWST CNSTH F241124473 [DWST]`,

  // Structure Fire with P codes
  `1353064	21:38:35 2024-11-18	@@ALERT 03106 SF 1A SWITCHBOARD SPARKING 22 FERNBANK CR MULGRAVE /PORTLAND ST //PORTLAND ST M 81 C4 (424001) F FGD12 P31A P87B F241124459 [FS87_]`,

  // UN incident with FS codes
  `1353136	21:14:26 2024-11-18	@@ALERT 05407 UN 1A SMOKE IN THE AREA BRODIES CREEK - GREENVALE FIRENZE RD GREENVALE /POSITANO GR M 178 K5 (134334) F CGREE FGD09 P54 P80 F241124452 [FS80_]`,

  // G&SC incident with station codes
  `0572960	21:20:55 2024-11-18	@@ALERT WALA2 G&SC1 BURNOFF SPREAD OT GRASS 602 BUNGAREE-WALLACE RD WALLACE /MURPHYS RD //ERIN CT SVC 8222 B4 (381391) F CBREE CWALA F241124453 [BREE]`
];

// Test each incident
testIncidents.forEach((incident, index) => {
  console.log(`\nTesting incident #${index + 1}:`);
  const result = parseIncidentData(incident);
  console.log(JSON.stringify(result, null, 2));
});