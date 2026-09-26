import type { ScoredVenue } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import { LABEL, WAITS, PRICE } from '../data/constants';
import { opensIn, peakWindow } from '../utils/time';

interface VenueCardProps {
  item: ScoredVenue;
  onOpen: (name: string) => void;
}

function GradientBg({ hue }: { hue: number }) {
  const a = hue;
  const b = (hue + 26) % 360;
  return (
    <div
      className="ph"
      style={{
        background: `linear-gradient(135deg,hsl(${a} 42% 76%),hsl(${b} 38% 62%) 58%,hsl(${a} 34% 48%))`,
      }}
    />
  );
}

export default function VenueCard({ item, onOpen }: VenueCardProps) {
  const { v, s, open } = item;
  const { isFav, toggleFav } = useFavorites();
  const faved = isFav(v.name);

  return (
    <div className="cardwrap">
      <button
        className={`card ${open ? "" : "shut"}`}
        onClick={() => onOpen(v.name)}
      >
        <div className="photo">
          <GradientBg hue={v.hue} />
          {v.photo && (
            <img
              src={v.photo}
              alt=""
              loading="lazy"
              onError={(e) => (e.currentTarget.style.display = "none")}
            />
          )}
          {open ? (
            <span className="pill">
              <span className="dot" style={{ background: `var(--${s.band})` }} />
              {LABEL[s.band]}
              <span className="sub">{s.val}%</span>
            </span>
          ) : (
            <span className="pill shut">Closed</span>
          )}
        </div>
        <div className="info">
          <div className="row1">
            <span className="title">{v.name}</span>
            <span className="rating">
              <svg viewBox="0 0 24 24">
                <path d="M12 2l3 6.6 7 .9-5 5 1.2 7-6.2-3.4L5.8 21.5 7 14.5l-5-5 7-.9z" />
              </svg>
              {v.rating}
              <span style={{ opacity: 0.6 }}>({(v.reviews / 1000).toFixed(1)}k)</span>
            </span>
          </div>
          <div className="row2">
            {v.cat}
            <span className="sep">&middot;</span>
            {PRICE[v.price]}
            <span className="sep">&middot;</span>
            {v.area}
          </div>
          {open ? (
            <div className="wait" style={{ color: `var(--${s.band})` }}>
              {WAITS[s.band]}
            </div>
          ) : (
            <div className="shutline">
              <b>{opensIn(v)}</b>
              <br />
              {peakWindow(v)}
            </div>
          )}
        </div>
      </button>
      <button
        className="fav"
        aria-pressed={faved ? "true" : "false"}
        aria-label={`${faved ? "Remove" : "Save"} ${v.name}`}
        onClick={(e) => {
          e.stopPropagation();
          toggleFav(v.name);
        }}
      >
        <svg viewBox="0 0 24 24">
          <path d="M12 21s-7.5-4.9-9.3-9A5 5 0 0 1 12 6.2 5 5 0 0 1 21.3 12c-1.8 4.1-9.3 9-9.3 9z" />
        </svg>
      </button>
    </div>
  );
}
