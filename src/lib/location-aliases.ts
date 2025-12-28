/**
 * Location Alias Mapping System for Guyana
 * Translates common location names to ISO region codes
 */

export const GUYANA_LOCATION_ALIASES: Record<string, string> = {
  // === City of Georgetown (GY-Georgetown) ===
  "georgetown": "GY-Georgetown",
  "kitty": "GY-Georgetown",
  "stabroek": "GY-Georgetown",
  "lacytown": "GY-Georgetown",
  "cummingsburg": "GY-Georgetown",
  "alberttown": "GY-Georgetown",
  "bourda": "GY-Georgetown",
  "newtown": "GY-Georgetown",
  "werk-en-rust": "GY-Georgetown",
  "robbstown": "GY-Georgetown",
  "queenstown": "GY-Georgetown",
  "bel air": "GY-Georgetown",
  "prashad nagar": "GY-Georgetown",
  "lamaha gardens": "GY-Georgetown",
  "subryanville": "GY-Georgetown",
  "campbellville": "GY-Georgetown",

  // === Demerara-Mahaica / Region 4 (GY-R4) ===
  "providence": "GY-R4",
  "eccles": "GY-R4",
  "diamond": "GY-R4",
  "grove": "GY-R4",
  "herstelling": "GY-R4",
  "farm": "GY-R4",
  "peter's hall": "GY-R4",
  "houston": "GY-R4",
  "ruimveldt": "GY-R4",
  "agricola": "GY-R4",
  "east bank": "GY-R4",
  "east bank demerara": "GY-R4",
  "ebd": "GY-R4",
  "east coast": "GY-R4",
  "east coast demerara": "GY-R4",
  "ecd": "GY-R4",
  "chateau margot": "GY-R4",
  "lusignan": "GY-R4",
  "ogle": "GY-R4",
  "atlantic gardens": "GY-R4",
  "sparendaam": "GY-R4",
  "beterverwagting": "GY-R4",
  "triumph": "GY-R4",
  "buxton": "GY-R4",
  "enmore": "GY-R4",
  "region 4": "GY-R4",
  "demerara-mahaica": "GY-R4",

  // === East Berbice-Corentyne / Region 6 (GY-R6) ===
  "new amsterdam": "GY-R6",
  "berbice": "GY-R6",
  "corriverton": "GY-R6",
  "springlands": "GY-R6",
  "skeldon": "GY-R6",
  "rose hall": "GY-R6",
  "port mourant": "GY-R6",
  "region 6": "GY-R6",
  "east berbice": "GY-R6",

  // === Mahaica-Berbice / Region 5 (GY-R5) ===
  "mahaica": "GY-R5",
  "fort wellington": "GY-R5",
  "rosignol": "GY-R5",
  "region 5": "GY-R5",

  // === Essequibo Islands-West Demerara / Region 3 (GY-R3) ===
  "west coast": "GY-R3",
  "west coast demerara": "GY-R3",
  "wcd": "GY-R3",
  "west bank": "GY-R3",
  "west bank demerara": "GY-R3",
  "vreed-en-hoop": "GY-R3",
  "leonora": "GY-R3",
  "uitvlugt": "GY-R3",
  "parika": "GY-R3",
  "region 3": "GY-R3",

  // === Pomeroon-Supenaam / Region 2 (GY-R2) ===
  "essequibo coast": "GY-R2",
  "anna regina": "GY-R2",
  "suddie": "GY-R2",
  "region 2": "GY-R2",

  // === Barima-Waini / Region 1 (GY-R1) ===
  "region 1": "GY-R1",
  "mabaruma": "GY-R1",

  // === Cuyuni-Mazaruni / Region 7 (GY-R7) ===
  "bartica": "GY-R7",
  "region 7": "GY-R7",

  // === Potaro-Siparuni / Region 8 (GY-R8) ===
  "mahdia": "GY-R8",
  "region 8": "GY-R8",

  // === Upper Takutu-Upper Essequibo / Region 9 (GY-R9) ===
  "lethem": "GY-R9",
  "region 9": "GY-R9",

  // === Upper Demerara-Berbice / Region 10 (GY-R10) ===
  "linden": "GY-R10",
  "region 10": "GY-R10",
};

// Friendly display names for regions
export const REGION_DISPLAY_NAMES: Record<string, string> = {
  "GY-Georgetown": "Georgetown",
  "GY-R4": "Demerara-Mahaica",
  "GY-R6": "East Berbice-Corentyne",
  "GY-R5": "Mahaica-Berbice",
  "GY-R3": "Essequibo Islands-West Demerara",
  "GY-R2": "Pomeroon-Supenaam",
  "GY-R1": "Barima-Waini",
  "GY-R7": "Cuyuni-Mazaruni",
  "GY-R8": "Potaro-Siparuni",
  "GY-R9": "Upper Takutu-Upper Essequibo",
  "GY-R10": "Upper Demerara-Berbice",
};

// Areas included in each region (for user messaging)
export const REGION_INCLUDES: Record<string, string[]> = {
  "GY-Georgetown": ["Kitty", "Stabroek", "Cummingsburg", "Lamaha Gardens", "Bel Air"],
  "GY-R4": ["Providence", "Eccles", "Diamond", "East Bank", "East Coast"],
  "GY-R6": ["New Amsterdam", "Corriverton", "Rose Hall"],
  "GY-R3": ["West Coast", "Vreed-en-Hoop", "Parika"],
  "GY-R5": ["Mahaica", "Fort Wellington", "Rosignol"],
  "GY-R2": ["Anna Regina", "Suddie", "Essequibo Coast"],
  "GY-R7": ["Bartica"],
  "GY-R10": ["Linden"],
};

/**
 * Resolves a user search term to a region code
 * Returns null if no alias match found
 */
export function resolveLocationAlias(searchTerm: string): string | null {
  const normalized = searchTerm.toLowerCase().trim();
  return GUYANA_LOCATION_ALIASES[normalized] || null;
}

/**
 * Gets a user-friendly display name for a region code
 */
export function getRegionDisplayName(regionCode: string): string {
  return REGION_DISPLAY_NAMES[regionCode] || regionCode;
}

/**
 * Gets a user-friendly message for search results
 * Example: "Properties in Demerara-Mahaica (includes Providence, Eccles, East Bank)"
 */
export function getRegionDisplayMessage(regionCode: string, searchedTerm?: string): string {
  const displayName = REGION_DISPLAY_NAMES[regionCode] || regionCode;
  const includes = REGION_INCLUDES[regionCode];

  if (includes && includes.length > 0) {
    return `Properties in ${displayName} (includes ${includes.slice(0, 3).join(", ")})`;
  }
  return `Properties in ${displayName}`;
}

/**
 * Gets all region codes that could match a partial search term
 * Used for partial matching like "Prov" -> Providence -> GY-R4
 */
export function findMatchingRegions(partialTerm: string): string[] {
  const normalized = partialTerm.toLowerCase().trim();
  const matches = new Set<string>();

  for (const [alias, regionCode] of Object.entries(GUYANA_LOCATION_ALIASES)) {
    if (alias.includes(normalized)) {
      matches.add(regionCode);
    }
  }

  return Array.from(matches);
}
