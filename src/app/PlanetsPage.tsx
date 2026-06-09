// /src/pages/PlanetPage.tsx
import { useState, useEffect } from 'react';
import '../assets/css/PlanetPage.css';

interface PlanetDto {
  id: number;
  name: string;
  meanRadiusKm: number;
  moons: number;
  description?: string;
}

interface SatelliteDto {
  id: number;
  name: string;
  radiusKm: number;
  orbitalPeriodDays?: number;
  planetId: number;
  planetName: string;
  description?: string;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_BASE = `${API_BASE_URL}/api/Planets`;

const PlanetPage = () => {
  const [planets, setPlanets] = useState<PlanetDto[]>([]);
  const [allSatellites, setAllSatellites] = useState<SatelliteDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedDescs, setExpandedDescs] = useState<Set<number>>(new Set());
  const [expandedSats, setExpandedSats] = useState<Set<number>>(new Set());

  // Fetch both planets and satellites on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planetsRes, satellitesRes] = await Promise.all([
          fetch(API_BASE),
          fetch(`${API_BASE}/satellites`),
        ]);
        if (!planetsRes.ok) throw new Error(`Planets: HTTP ${planetsRes.status}`);
        if (!satellitesRes.ok) throw new Error(`Satellites: HTTP ${satellitesRes.status}`);

        const planetsData: PlanetDto[] = await planetsRes.json();
        const satellitesData: SatelliteDto[] = await satellitesRes.json();

        setPlanets(planetsData);
        setAllSatellites(satellitesData);
      } catch (err: Error | unknown) {
        const message = err instanceof Error ? err.message : 'Failed to load data';
        setError(message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleDesc = (id: number) => {
    setExpandedDescs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSatellites = (planetId: number) => {
    setExpandedSats((prev) => {
      const next = new Set(prev);
      if (next.has(planetId)) {
        next.delete(planetId);
      } else {
        next.add(planetId);
      }
      return next;
    });
  };

  const radiusScale = (r: number) => {
    const min = 30, max = 90;
    const allRadii = planets.map((p) => p.meanRadiusKm);
    const lo = Math.min(...allRadii), hi = Math.max(...allRadii);
    if (hi === lo) return (min + max) / 2;
    return min + ((r - lo) / (hi - lo)) * (max - min);
  };

  return (
    <div className="planet-page-container">
      {/* Background effects */}
      <div className="planet-page-nebula planet-page-nebula-1" />
      <div className="planet-page-nebula planet-page-nebula-2" />
      <div className="planet-page-nebula planet-page-nebula-3" />
      <div className="planet-page-shooting-star planet-page-shooting-star-1" />
      <div className="planet-page-shooting-star planet-page-shooting-star-2" />
      <div className="planet-page-shooting-star planet-page-shooting-star-3" />

      <header className="planet-page-header">
        <h1 className="planet-page-title">Explore the Planets</h1>
        <p className="planet-page-subtitle">
          Select a planet to reveal its moons and satellites
        </p>
      </header>

      {loading && (
        <div className="planet-page-loader">
          <div className="planet-page-spinner" />
          <span>Loading planets…</span>
        </div>
      )}

      {error && (
        <div className="planet-page-error">
          <span className="planet-page-error-icon">⚠</span>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && planets.length === 0 && (
        <p className="planet-page-empty">No planets found.</p>
      )}

      <div className="planet-page-grid">
        {planets.map((planet) => {
          const size = radiusScale(planet.meanRadiusKm);
          const isDescOpen = expandedDescs.has(planet.id);
          const isSatOpen = expandedSats.has(planet.id);
          const planetSatellites = allSatellites.filter((s) => s.planetId === planet.id);

          return (
            <div
              key={planet.id}
              className={`planet-page-card ${isSatOpen ? 'planet-page-card-expanded' : ''}`}
            >
              {/* Visual orb */}
              <div className="planet-page-orb-wrapper">
                <div
                  className="planet-page-orb"
                  style={{ width: size, height: size }}
                >
                  <div className="planet-page-orb-ring" />
                </div>
              </div>

              <div className="planet-page-card-body">
                <h2 className="planet-page-card-name">{planet.name}</h2>

                <div className="planet-page-stats">
                  <div className="planet-page-stat">
                    <span className="planet-page-stat-value">
                      {planet.meanRadiusKm.toLocaleString()}
                    </span>
                    <span className="planet-page-stat-label">Radius (km)</span>
                  </div>
                  <div className="planet-page-stat">
                    <span className="planet-page-stat-value">{planet.moons}</span>
                    <span className="planet-page-stat-label">Moons</span>
                  </div>
                </div>

                {/* Collapsible description */}
                {planet.description && (
                  <div className="planet-page-desc-wrapper">
                    <p
                      className={`planet-page-card-desc ${isDescOpen ? 'planet-page-card-desc-expanded' : ''
                        }`}
                    >
                      {planet.description}
                    </p>
                    <button
                      className="planet-page-desc-toggle"
                      onClick={() => toggleDesc(planet.id)}
                    >
                      {isDescOpen ? 'Show less' : 'Read more'}
                    </button>
                  </div>
                )}

                {/* Satellites toggle */}
                <button
                  className="planet-page-toggle"
                  aria-expanded={isSatOpen}
                  onClick={() => toggleSatellites(planet.id)}
                >
                  {isSatOpen ? 'Hide Satellites' : `View Satellites (${planetSatellites.length})`}
                  <svg
                    className={`planet-page-chevron ${isSatOpen ? 'planet-page-chevron-open' : ''}`}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </button>

                {/* Satellites Panel */}
                {isSatOpen && (
                  <div className="planet-page-sat-panel-visible">
                    {planetSatellites.length === 0 ? (
                      <p className="planet-page-sat-empty">No satellites recorded.</p>
                    ) : (
                      <div className="planet-page-sat-list">
                        {planetSatellites.map((sat) => (
                          <div key={sat.id} className="planet-page-sat-item">
                            <div className="planet-page-sat-dot" />
                            <div className="planet-page-sat-info">
                              <span className="planet-page-sat-name">{sat.name}</span>
                              <span className="planet-page-sat-detail">
                                {sat.radiusKm.toLocaleString()} km
                                {sat.orbitalPeriodDays != null &&
                                  ` · ${sat.orbitalPeriodDays.toFixed(1)} day orbit`}
                              </span>
                              {sat.description && (
                                <span className="planet-page-sat-desc">
                                  {sat.description}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlanetPage;