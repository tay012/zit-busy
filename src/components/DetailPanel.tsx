import { useRef, useEffect } from 'react';
import type { Venue } from '../types';
import { useCity } from '../contexts/CityContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { useReports } from '../contexts/ReportsContext';
import { useBodyLock } from '../hooks/useBodyLock';
import { score } from '../utils/scoring';
import { isOpen, fmt, opensIn, peakWindow } from '../utils/time';
import { LABEL, PRICE } from '../data/constants';
import {
  RESERVE_PROVIDER,
  DELIVERY_PROVIDER,
  RESERVABLE_CATS,
  NO_DELIVERY_CATS,
  buildSearchUrl,
} from '../data/links';

interface DetailPanelProps {
  venueName: string | null;
  onClose: () => void;
  onReport: (name: string) => void;
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

export default function DetailPanel({ venueName, onClose, onReport }: DetailPanelProps) {
  const { venues, cityName } = useCity();
  const { isFav, toggleFav } = useFavorites();
  const { reports } = useReports();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isOn = venueName !== null;

  useBodyLock(isOn);

  useEffect(() => {
    if (isOn && scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [venueName, isOn]);

  const v = isOn ? venues.find((x) => x.name === venueName) : null;
  if (!v) {
    return <div className={`detail ${isOn ? "on" : ""}`} ref={scrollRef} />;
  }

  const s = score(v, reports);
  const op = isOpen(v);
  const h = new Date().getHours();
  const faved = isFav(v.name);
  const searchQuery = `${v.name} ${cityName}`;
  const canReserve = RESERVABLE_CATS.includes(v.cat);
  const canDeliver = !NO_DELIVERY_CATS.includes(v.cat);

  return (
    <div className={`detail ${isOn ? "on" : ""}`} ref={scrollRef}>
      <div className={`hero ${op ? "" : "shut"}`}>
        <GradientBg hue={v.hue} />
        <button className="back" onClick={onClose} aria-label="Back">
          <svg viewBox="0 0 24 24">
            <path d="M15 5l-7 7 7 7" />
          </svg>
        </button>
      </div>

      <div className="dhead">
        <h1>{v.name}</h1>
        <div className="dmeta">
          ★ {v.rating} ({v.reviews.toLocaleString()}) &middot; {v.cat} &middot;{" "}
          {PRICE[v.price]} &middot; {v.area}
        </div>
        <div className="status" style={{ color: `var(--${op ? s.band : "text-2"})` }}>
          <div>
            <div className="big">
              {op ? `${LABEL[s.band]} — ${s.val}% of peak` : "Closed right now"}
            </div>
            <div className="note">
              {op ? s.src : `${opensIn(v)} \u00B7 ${peakWindow(v)}`}
            </div>
          </div>
          <div className="bars">
            {v.curve.map((p, i) => (
              <i
                key={i}
                className={`${p > 0 ? "on" : ""} ${i === h ? "now" : ""}`}
                style={{ height: `${Math.max(3, p * 0.34)}px` }}
              />
            ))}
          </div>
        </div>
        <div className="hours">
          Hours today: <b>{fmt(v.open)} – {fmt(v.close)}</b>
        </div>
      </div>

      <div className="actions">
        <button
          className="btn primary"
          disabled={!op}
          onClick={() => op && onReport(v.name)}
        >
          {op ? "I'm here now" : "Closed"}
        </button>
        <button
          className="btn"
          aria-pressed={faved ? "true" : "false"}
          onClick={() => toggleFav(v.name)}
        >
          {faved ? "♥ Saved" : "♡ Save"}
        </button>
        {canReserve && (
          <a
            className="btn"
            href={buildSearchUrl(RESERVE_PROVIDER, searchQuery)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Reserve a table
          </a>
        )}
        {canDeliver && (
          <a
            className="btn"
            href={buildSearchUrl(DELIVERY_PROVIDER, searchQuery)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Order delivery
          </a>
        )}
      </div>

      <div className="menu">
        {v.menu.map(([sec, items]) => (
          <div key={sec}>
            <h3>{sec}</h3>
            {items.map(([n, ds, p]) => (
              <div className="item" key={n}>
                <div className="t">
                  <div className="n">{n}</div>
                  {ds && <div className="d">{ds}</div>}
                  <div className="p">${p}</div>
                </div>
                <div className="thumb">
                  <GradientBg hue={v.hue} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
