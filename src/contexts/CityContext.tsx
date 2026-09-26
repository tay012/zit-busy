import { createContext, useContext, useState, useMemo, useCallback, type ReactNode } from 'react';
import type { Venue } from '../types';
import { CITIES } from '../data/cities';
import { VENUES } from '../data/venues';
import { store } from '../hooks/useStore';

interface CityContextValue {
  currentCity: string;
  cityName: string;
  venues: Venue[];
  areas: string[];
  switchCity: (key: string) => void;
}

const CityContext = createContext<CityContextValue>(null!);

export function CityProvider({ children }: { children: ReactNode }) {
  const [currentCity, setCurrentCity] = useState(() => store.get("rn:city", "rva"));

  const venues = useMemo(() => VENUES[currentCity] || [], [currentCity]);
  const areas = useMemo(() => [...new Set(venues.map((v) => v.area))].sort(), [venues]);
  const cityName = CITIES[currentCity]?.name || currentCity;

  const switchCity = useCallback((key: string) => {
    setCurrentCity(key);
    store.set("rn:city", key);
  }, []);

  return (
    <CityContext.Provider value={{ currentCity, cityName, venues, areas, switchCity }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
}
