import { useFilters } from '../contexts/FilterContext';
import { useFavorites } from '../contexts/FavoritesContext';
import VenueCard from './VenueCard';

interface FeedProps {
  onOpenDetail: (name: string) => void;
}

export default function Feed({ onOpenDetail }: FeedProps) {
  const { filters, setFilter, clearAll, results } = useFilters();
  const { favs } = useFavorites();

  const open = results.filter((x) => x.open);
  const shut = results.filter((x) => !x.open);

  const handleClear = () => {
    clearAll();
    setFilter({ q: "", cat: "All", favOnly: false });
  };

  if (!results.length) {
    const msg =
      filters.favOnly && !favs.size
        ? "You haven't saved any places yet.<br>Tap the heart on a card to save it."
        : filters.q
          ? `No places match "${filters.q}".`
          : "Nothing matches these filters.";
    const btnText =
      filters.favOnly && !favs.size
        ? "Show all places"
        : filters.q
          ? "Clear search and filters"
          : "Clear filters";

    return (
      <div className="feed">
        <div className="empty">
          <span dangerouslySetInnerHTML={{ __html: msg }} />
          <br />
          <button onClick={handleClear}>{btnText}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="feed">
      {open.map((item) => (
        <VenueCard key={item.v.name} item={item} onOpen={onOpenDetail} />
      ))}
      {shut.length > 0 && !filters.openOnly && (
        <>
          <div className="divider">Closed right now</div>
          {shut.map((item) => (
            <VenueCard key={item.v.name} item={item} onOpen={onOpenDetail} />
          ))}
        </>
      )}
    </div>
  );
}
