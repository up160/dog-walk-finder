const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

function buildQuery(lat, lon, radiusMeters, tagPairs) {
  const unions = tagPairs
    .map(([k, v]) => `
      node["${k}"="${v}"](around:${radiusMeters},${lat},${lon});
      way["${k}"="${v}"](around:${radiusMeters},${lat},${lon});
      relation["${k}"="${v}"](around:${radiusMeters},${lat},${lon});
    `)
    .join('');
  return `[out:json][timeout:25];(${unions});out center tags;`;
}

export async function fetchPOIs(lat, lon, radiusMeters, tagPairs) {
  const query = buildQuery(lat, lon, radiusMeters, tagPairs);
  const res = await fetch(OVERPASS_URL, {
    method: 'POST',
    body: `data=${encodeURIComponent(query)}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
  if (!res.ok) throw new Error(`Overpass error: ${res.status}`);
  const data = await res.json();

  return data.elements.map((el) => {
    const lat = el.lat ?? el.center?.lat;
    const lon = el.lon ?? el.center?.lon;
    return {
      id: `${el.type}/${el.id}`,
      lat,
      lon,
      name: el.tags?.name || el.tags?.['name:en'] || null,
      tags: el.tags || {},
      type: el.type,
      osmId: el.id,
    };
  }).filter((p) => p.lat && p.lon);
}

export function distanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function formatDistance(meters) {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}
