import { useFilters } from '../contexts/FilterContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { CATS } from '../data/constants';

interface FilterRailProps {
  onOpenPanel: () => void;
}

export default function FilterRail({ onOpenPanel }: FilterRailProps) {
  const { filters, setFilter, filterCount } = useFilters();
  const { favs } = useFavorites();

  return (
    <div className="rail">
      <button
        className="chip filters"
        data-active={String(filterCount > 0)}
        onClick={onOpenPanel}
      >
        <svg viewBox="0 0 24 24">
          <path d="M3 5h18v2l-7 7v6l-4-2v-4L3 7z" />
        </svg>
        Filters
        {filterCount > 0 && <span className="badge">{filterCount}</span>}
      </button>

      <button
        className="chip"
        aria-pressed={filters.favOnly ? "true" : "false"}
        onClick={() => setFilter({ favOnly: !filters.favOnly })}
      >
        ♥ Saved{favs.size ? ` ${favs.size}` : ""}
      </button>

      {CATS.map((c) => (
        <button
          key={c}
          className="chip"
          aria-pressed={c === filters.cat ? "true" : "false"}
          onClick={() => setFilter({ cat: c })}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
