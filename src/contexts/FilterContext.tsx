import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
import type { FilterState, ScoredVenue, BusyBand } from '../types';
import { useCity } from './CityContext';
import { useFavorites } from './FavoritesContext';
import { useReports } from './ReportsContext';
import { apply, activeCount } from '../utils/filtering';

const defaultFilter: FilterState = {
  cat: "All",
  q: "",
  favOnly: false,
  busy: [],
  price: [],
  area: [],
  rating: 0,
  showClosed: true,
  openOnly: false,
};

interface FilterContextValue {
  filters: FilterState;
  setFilter: (partial: Partial<FilterState>) => void;
  clearAll: () => void;
  results: ScoredVenue[];
  filterCount: number;
  tick: () => void;
  // Draft for filter panel
  draft: FilterState | null;
  openDraft: () => void;
  updateDraft: (partial: Partial<FilterState>) => void;
  clearDraft: () => void;
  applyDraft: () => void;
  draftResultCount: number;
}

const FilterContext = createContext<FilterContextValue>(null!);

export function FilterProvider({ children }: { children: ReactNode }) {
  const { venues, currentCity } = useCity();
  const { favs } = useFavorites();
  const { reports } = useReports();
  const [filters, setFilters] = useState<FilterState>({ ...defaultFilter });
  const [draft, setDraft] = useState<FilterState | null>(null);
  const [tickVal, setTickVal] = useState(0);
  const prevCity = useRef(currentCity);

  // Reset filters when city changes
  useEffect(() => {
    if (prevCity.current !== currentCity) {
      prevCity.current = currentCity;
      setFilters({ ...defaultFilter });
      setDraft(null);
    }
  }, [currentCity]);

  const tick = useCallback(() => setTickVal((v) => v + 1), []);

  const results = useMemo(
    () => apply(venues, filters, favs, reports),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [venues, filters, favs, reports, tickVal]
  );

  const filterCount = useMemo(() => activeCount(filters), [filters]);

  const setFilter = useCallback((partial: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  }, []);

  const clearAll = useCallback(() => {
    setFilters((prev) => ({
      ...defaultFilter,
      cat: prev.cat,
    }));
  }, []);

  const openDraft = useCallback(() => {
    setDraft({ ...filters, busy: [...filters.busy], price: [...filters.price], area: [...filters.area] });
  }, [filters]);

  const updateDraft = useCallback((partial: Partial<FilterState>) => {
    setDraft((prev) => (prev ? { ...prev, ...partial } : prev));
  }, []);

  const clearDraft = useCallback(() => {
    setDraft((prev) =>
      prev
        ? { ...prev, busy: [] as BusyBand[], price: [], area: [], rating: 0, showClosed: true, openOnly: false }
        : prev
    );
  }, []);

  const applyDraft = useCallback(() => {
    if (draft) {
      setFilters({ ...draft });
      setDraft(null);
    }
  }, [draft]);

  const draftResultCount = useMemo(() => {
    if (!draft) return 0;
    return apply(venues, draft, favs, reports).length;
  }, [draft, venues, favs, reports]);

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilter,
        clearAll,
        results,
        filterCount,
        tick,
        draft,
        openDraft,
        updateDraft,
        clearDraft,
        applyDraft,
        draftResultCount,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  return useContext(FilterContext);
}
