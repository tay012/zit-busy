import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import { store } from '../hooks/useStore';
import { useCity } from './CityContext';

interface FavoritesContextValue {
  favs: Set<string>;
  toggleFav: (name: string) => void;
  isFav: (name: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue>(null!);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { currentCity } = useCity();
  const [favs, setFavs] = useState<Set<string>>(
    () => new Set(store.get<string[]>("rn:favs:" + currentCity, []))
  );

  useEffect(() => {
    setFavs(new Set(store.get<string[]>("rn:favs:" + currentCity, [])));
  }, [currentCity]);

  const toggleFav = useCallback(
    (name: string) => {
      setFavs((prev) => {
        const next = new Set(prev);
        if (next.has(name)) next.delete(name);
        else next.add(name);
        store.set("rn:favs:" + currentCity, [...next]);
        return next;
      });
    },
    [currentCity]
  );

  const isFav = useCallback((name: string) => favs.has(name), [favs]);

  return (
    <FavoritesContext.Provider value={{ favs, toggleFav, isFav }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
