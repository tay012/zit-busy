import { useTheme } from '../contexts/ThemeContext';
import { useCity } from '../contexts/CityContext';
import { useFilters } from '../contexts/FilterContext';
import { CITIES } from '../data/cities';

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();
  const { currentCity, switchCity } = useCity();
  const { filters, setFilter } = useFilters();

  return (
    <div className="bar">
      <div className="loc">
        <svg viewBox="0 0 24 24">
          <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
        </svg>
        <div className="citypick">
          <select
            value={currentCity}
            onChange={(e) => switchCity(e.target.value)}
          >
            {Object.entries(CITIES).map(([k, c]) => (
              <option key={k} value={k}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button
          className="theme"
          onClick={toggleTheme}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <svg viewBox="0 0 24 24">
              <path d="M12 17a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-13.2a1 1 0 0 1-1-1V1.6a1 1 0 1 1 2 0v1.2a1 1 0 0 1-1 1zm0 18.6a1 1 0 0 1-1-1v-1.2a1 1 0 1 1 2 0v1.2a1 1 0 0 1-1 1zM4.2 12a1 1 0 0 1-1 1H2a1 1 0 1 1 0-2h1.2a1 1 0 0 1 1 1zm18.8 0a1 1 0 0 1-1 1h-1.2a1 1 0 1 1 0-2H22a1 1 0 0 1 1 1zM6 6a1 1 0 0 1-1.4 0l-.9-.8A1 1 0 0 1 5.1 3.7l.9.9A1 1 0 0 1 6 6zm13.8 13.8a1 1 0 0 1-1.4 0l-.9-.9a1 1 0 0 1 1.4-1.4l.9.9a1 1 0 0 1 0 1.4zM6 18a1 1 0 0 1 0 1.4l-.9.9a1 1 0 0 1-1.4-1.4l.9-.9A1 1 0 0 1 6 18zM19.8 4.2a1 1 0 0 1 0 1.4l-.9.9a1 1 0 1 1-1.4-1.4l.9-.9a1 1 0 0 1 1.4 0z" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24">
              <path d="M21.6 13.3A9 9 0 0 1 10.7 2.4a1 1 0 0 0-1.3-1.2A11 11 0 1 0 22.8 14.6a1 1 0 0 0-1.2-1.3z" />
            </svg>
          )}
        </button>
      </div>
      <div className="search">
        <svg viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27A6.47 6.47 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z" />
        </svg>
        <input
          type="search"
          autoComplete="off"
          placeholder="Search restaurants, bars, coffee"
          aria-label="Search places"
          value={filters.q}
          onChange={(e) => setFilter({ q: e.target.value.trim() })}
        />
      </div>
    </div>
  );
}
