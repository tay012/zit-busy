import { useFilters } from '../contexts/FilterContext';
import { useCity } from '../contexts/CityContext';
import { useBodyLock } from '../hooks/useBodyLock';
import { LABEL, PRICE } from '../data/constants';
import type { BusyBand } from '../types';

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterPanel({ isOpen, onClose }: FilterPanelProps) {
  const { draft, updateDraft, clearDraft, applyDraft, draftResultCount } = useFilters();
  const { areas } = useCity();

  useBodyLock(isOpen);

  if (!isOpen || !draft) return <div className="panel" />;

  const toggleArray = <T,>(arr: T[], val: T): T[] => {
    const i = arr.indexOf(val);
    return i < 0 ? [...arr, val] : arr.filter((_, idx) => idx !== i);
  };

  const handleApply = () => {
    applyDraft();
    onClose();
  };

  return (
    <div className={`panel ${isOpen ? "on" : ""}`}>
      <div className="bg" onClick={onClose} />
      <div className="box">
        <div className="phead">
          <h2>Filters</h2>
          <button className="x" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <div className="pbody">
          {/* How busy */}
          <div className="grp">
            <h3>How busy</h3>
            <div className="opts">
              {(["quiet", "moderate", "packed"] as BusyBand[]).map((b) => (
                <button
                  key={b}
                  className="opt"
                  aria-pressed={draft.busy.includes(b) ? "true" : "false"}
                  onClick={() => updateDraft({ busy: toggleArray(draft.busy, b) })}
                >
                  <span className="dot" style={{ background: `var(--${b})` }} />
                  {LABEL[b]}
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="grp">
            <h3>Price</h3>
            <div className="opts">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className="opt"
                  aria-pressed={draft.price.includes(p) ? "true" : "false"}
                  onClick={() => updateDraft({ price: toggleArray(draft.price, p) })}
                >
                  {PRICE[p]}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="grp">
            <h3>Rating</h3>
            <div className="opts">
              {[4.0, 4.5, 4.7].map((r) => (
                <button
                  key={r}
                  className="opt"
                  aria-pressed={draft.rating === r ? "true" : "false"}
                  onClick={() => updateDraft({ rating: draft.rating === r ? 0 : r })}
                >
                  ★ {r.toFixed(1)}+
                </button>
              ))}
            </div>
          </div>

          {/* Neighborhood */}
          <div className="grp">
            <h3>Neighborhood</h3>
            <div className="opts">
              {areas.map((a) => (
                <button
                  key={a}
                  className="opt"
                  aria-pressed={draft.area.includes(a) ? "true" : "false"}
                  onClick={() => updateDraft({ area: toggleArray(draft.area, a) })}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="grp">
            <div className="toggle">
              <span>
                Open now only
                <small>Hide everything that's closed</small>
              </span>
              <button
                className="sw"
                aria-pressed={draft.openOnly ? "true" : "false"}
                aria-label="Open now only"
                onClick={() => {
                  const next = !draft.openOnly;
                  updateDraft({
                    openOnly: next,
                    ...(next ? { showClosed: false } : {}),
                  });
                }}
              />
            </div>
            <div className="toggle">
              <span>
                Show closed places
                <small>Listed below with opening times</small>
              </span>
              <button
                className="sw"
                aria-pressed={draft.showClosed ? "true" : "false"}
                aria-label="Show closed places"
                onClick={() => {
                  const next = !draft.showClosed;
                  updateDraft({
                    showClosed: next,
                    ...(next ? { openOnly: false } : {}),
                  });
                }}
              />
            </div>
          </div>
        </div>
        <div className="pfoot">
          <button onClick={clearDraft}>Clear all</button>
          <button className="apply" onClick={handleApply}>
            {draftResultCount
              ? `Show ${draftResultCount} place${draftResultCount === 1 ? "" : "s"}`
              : "No matches"}
          </button>
        </div>
      </div>
    </div>
  );
}
