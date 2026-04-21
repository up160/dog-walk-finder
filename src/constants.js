export const WALK_TYPES = {
  DOG: { id: 'dog', label: 'Off-lead', emoji: '🐕', description: 'Open fields, commons, parks' },
  BIKE: { id: 'bike', label: 'Bike + Dog', emoji: '🚴', description: 'Bridleways & cycle paths' },
  KIDS: { id: 'kids', label: 'Kids + Dog', emoji: '👨‍👩‍👧', description: 'Parks, playgrounds, flat routes' },
};

export const RADII = [1000, 3000, 5000];

export const POI_CATEGORIES = {
  castles: {
    label: 'Castles & Ruins',
    emoji: '🏰',
    color: '#8B4513',
    queries: [
      ['historic', 'castle'],
      ['historic', 'ruins'],
      ['historic', 'archaeological_site'],
    ],
  },
  woods: {
    label: 'Woods & Forests',
    emoji: '🌲',
    color: '#228B22',
    queries: [
      ['natural', 'wood'],
      ['landuse', 'forest'],
    ],
  },
  playgrounds: {
    label: 'Playgrounds & Parks',
    emoji: '🛝',
    color: '#FF69B4',
    queries: [
      ['leisure', 'playground'],
      ['leisure', 'park'],
    ],
  },
  viewpoints: {
    label: 'Viewpoints',
    emoji: '👀',
    color: '#4169E1',
    queries: [['tourism', 'viewpoint']],
  },
  water: {
    label: 'Water Features',
    emoji: '💧',
    color: '#00BFFF',
    queries: [
      ['natural', 'water'],
      ['waterway', 'river'],
      ['waterway', 'waterfall'],
    ],
  },
  pitstops: {
    label: 'Pit Stops',
    emoji: '☕',
    color: '#D2691E',
    queries: [
      ['amenity', 'cafe'],
      ['amenity', 'pub'],
      ['shop', 'farm'],
    ],
  },
  ancient: {
    label: 'Ancient & Historic',
    emoji: '🗿',
    color: '#696969',
    queries: [
      ['historic', 'standing_stone'],
      ['historic', 'monument'],
      ['historic', 'hill_fort'],
    ],
  },
};

// Overpass query builders per walk type — returns relevant OSM tags to highlight
export const WALK_TYPE_TAGS = {
  dog: [
    ['leisure', 'common'],
    ['leisure', 'nature_reserve'],
    ['leisure', 'park'],
    ['landuse', 'grass'],
    ['natural', 'heath'],
  ],
  bike: [
    ['highway', 'bridleway'],
    ['highway', 'cycleway'],
    ['route', 'bicycle'],
    ['surface', 'unpaved'],
  ],
  kids: [
    ['leisure', 'playground'],
    ['leisure', 'park'],
    ['highway', 'footway'],
    ['surface', 'paved'],
  ],
};
