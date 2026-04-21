import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { POI_CATEGORIES } from './constants';
import { distanceMeters, formatDistance } from './overpass';

// Fix Leaflet default marker icon paths broken by Vite bundling
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function createEmojiIcon(emoji) {
  return L.divIcon({
    html: `<div style="font-size:22px;line-height:1;filter:drop-shadow(0 1px 2px rgba(0,0,0,0.4))">${emoji}</div>`,
    className: '',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
}

function RecenterMap({ lat, lon }) {
  const map = useMap();
  const prevRef = useRef(null);
  useEffect(() => {
    const key = `${lat},${lon}`;
    if (prevRef.current !== key) {
      map.setView([lat, lon], map.getZoom());
      prevRef.current = key;
    }
  }, [lat, lon, map]);
  return null;
}

export default function MapView({ location, radius, pois, activeCats, selectedPoi, onSelectPoi }) {
  const osKey = import.meta.env.VITE_OS_API_KEY;

  const tileUrl = osKey
    ? `https://api.os.uk/maps/raster/v1/zxy/Leisure_27700/{z}/{x}/{y}.png?key=${osKey}`
    : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

  const tileAttrib = osKey
    ? '&copy; <a href="https://www.ordnancesurvey.co.uk">Ordnance Survey</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

  return (
    <MapContainer
      center={[location.lat, location.lon]}
      zoom={14}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <RecenterMap lat={location.lat} lon={location.lon} />
      <TileLayer url={tileUrl} attribution={tileAttrib} maxZoom={20} />

      {/* Radius circle */}
      <Circle
        center={[location.lat, location.lon]}
        radius={radius}
        pathOptions={{ color: '#3B82F6', fillColor: '#3B82F6', fillOpacity: 0.06, weight: 2 }}
      />

      {/* Current location */}
      <Marker position={[location.lat, location.lon]}>
        <Popup>You are here</Popup>
      </Marker>

      {/* POI pins */}
      {pois
        .filter((p) => activeCats.has(p.category))
        .map((poi) => {
          const cat = POI_CATEGORIES[poi.category];
          const dist = formatDistance(distanceMeters(location.lat, location.lon, poi.lat, poi.lon));
          const name = poi.name || cat.label;
          return (
            <Marker
              key={poi.id}
              position={[poi.lat, poi.lon]}
              icon={createEmojiIcon(cat.emoji)}
              eventHandlers={{ click: () => onSelectPoi(poi) }}
            >
              <Popup>
                <strong>{name}</strong>
                <br />
                {cat.emoji} {cat.label}
                <br />
                📍 {dist} away
                <br />
                <a
                  href={`https://www.openstreetmap.org/${poi.type}/${poi.osmId}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.8em' }}
                >
                  View on OSM
                </a>
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
}
