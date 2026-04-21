import { useState, useEffect, useCallback } from 'react';
import MapView from './MapView';
import { useLocation } from './useLocation';
import { fetchPOIs } from './overpass';
import { WALK_TYPES, RADII, POI_CATEGORIES } from './constants';
import './App.css';

const LS_WALK_TYPE = 'dwf_walkType';
const LS_RADIUS = 'dwf_radius';
const LS_CATS = 'dwf_cats';

function loadPref(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const { location, error: locError, loading: locLoading, retry: relocate } = useLocation();
  const [walkType, setWalkType] = useState(() => loadPref(LS_WALK_TYPE, 'dog'));
  const [radius, setRadius] = useState(() => loadPref(LS_RADIUS, 3000));
  const [activeCats, setActiveCats] = useState(
    () => new Set(loadPref(LS_CATS, Object.keys(POI_CATEGORIES)))
  );
  const [pois, setPois] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [selectedPoi, setSelectedPoi] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { localStorage.setItem(LS_WALK_TYPE, JSON.stringify(walkType)); }, [walkType]);
  useEffect(() => { localStorage.setItem(LS_RADIUS, JSON.stringify(radius)); }, [radius]);
  useEffect(() => {
    localStorage.setItem(LS_CATS, JSON.stringify([...activeCats]));
  }, [activeCats]);

  const loadPOIs = useCallback(async (loc, rad) => {
    if (!loc) return;
    setFetching(true);
    setFetchError(null);
    try {
      const allPois = [];
      for (const [catId, cat] of Object.entries(POI_CATEGORIES)) {
        const results = await fetchPOIs(loc.lat, loc.lon, rad, cat.queries);
        results.forEach((p) => allPois.push({ ...p, category: catId }));
      }
      const seen = new Set();
      setPois(allPois.filter((p) => {
        if (seen.has(p.id)) return false;
        seen.add(p.id);
        return true;
      }));
    } catch (e) {
      setFetchError(e.message);
    } finally {
      setFetching(false);
    }
  }, []);

  useEffect(() => {
    if (location) loadPOIs(location, radius);
  }, [location, radius, loadPOIs]);

  function toggleCat(id) {
    setActiveCats((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  if (locLoading) {
    return (
      <div className="splash">
        <div className="splash-inner">
          <div className="spinner" />
          <p>Finding your location…</p>
        </div>
      </div>
    );
  }

  if (locError) {
    return (
      <div className="splash">
        <div className="splash-inner">
          <p className="error-msg">{locError}</p>
          <button className="btn-primary" onClick={relocate}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <span className="app-title">🐾 Walk Finder</span>
        </div>
        <div className="topbar-right">
          {fetching && <span className="loading-badge">Loading…</span>}
          <button className="btn-icon" onClick={() => setShowFilters((v) => !v)} title="Filters">
            ⚙️
          </button>
          <button className="btn-icon" onClick={() => loadPOIs(location, radius)} title="Refresh">
            🔄
          </button>
        </div>
      </header>

      <div className="walk-tabs">
        {Object.values(WALK_TYPES).map((wt) => (
          <button
            key={wt.id}
            className={`walk-tab ${walkType === wt.id ? 'active' : ''}`}
            onClick={() => setWalkType(wt.id)}
          >
            <span className="wt-emoji">{wt.emoji}</span>
            <span className="wt-label">{wt.label}</span>
          </button>
        ))}
      </div>

      <div className="radius-bar">
        {RADII.map((r) => (
          <button
            key={r}
            className={`radius-btn ${radius === r ? 'active' : ''}`}
            onClick={() => setRadius(r)}
          >
            {r >= 1000 ? `${r / 1000}km` : `${r}m`}
          </button>
        ))}
        <span className="poi-count">{pois.filter(p => activeCats.has(p.category)).length} places</span>
      </div>

      <div className="map-wrap">
        {location && (
          <MapView
            location={location}
            radius={radius}
            pois={pois}
            activeCats={activeCats}
            selectedPoi={selectedPoi}
            onSelectPoi={setSelectedPoi}
          />
        )}
      </div>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-header">
            <span>Filter POIs</span>
            <button className="btn-close" onClick={() => setShowFilters(false)}>✕</button>
          </div>
          <div className="filter-list">
            {Object.entries(POI_CATEGORIES).map(([id, cat]) => (
              <label key={id} className="filter-row">
                <input
                  type="checkbox"
                  checked={activeCats.has(id)}
                  onChange={() => toggleCat(id)}
                />
                <span>{cat.emoji} {cat.label}</span>
              </label>
            ))}
          </div>
          <div className="filter-actions">
            <button onClick={() => setActiveCats(new Set(Object.keys(POI_CATEGORIES)))}>All</button>
            <button onClick={() => setActiveCats(new Set())}>None</button>
          </div>
        </div>
      )}

      {fetchError && (
        <div className="toast error-toast">
          ⚠️ {fetchError}
          <button onClick={() => setFetchError(null)}>✕</button>
        </div>
      )}
    </div>
  );
}
