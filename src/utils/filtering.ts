import type { Venue, FilterState, ScoredVenue, Report } from '../types';
import { score } from './scoring';
import { isOpen } from './time';

export function activeCount(f: FilterState): number {
  return (
    f.busy.length +
    f.price.length +
    f.area.length +
    (f.rating ? 1 : 0) +
    (f.openOnly ? 1 : 0) +
    (f.showClosed ? 0 : 1)
  );
}

export function matches(v: Venue, q: string): boolean {
  if (!q) return true;
  const hay = (v.name + " " + v.cat + " " + v.area).toLowerCase();
  return q
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean)
    .every((w) => hay.includes(w));
}

export function apply(
  venues: Venue[],
  f: FilterState,
  favs: Set<string>,
  reports: Record<string, Report>
): ScoredVenue[] {
  return venues
    .map((v) => ({ v, s: score(v, reports), open: isOpen(v) }))
    .filter((x) => {
      if (!matches(x.v, f.q)) return false;
      if (f.favOnly && !favs.has(x.v.name)) return false;
      if (f.cat !== "All" && x.v.cat !== f.cat) return false;
      if (f.price.length && !f.price.includes(x.v.price)) return false;
      if (f.area.length && !f.area.includes(x.v.area)) return false;
      if (f.rating && x.v.rating < f.rating) return false;
      if (f.openOnly && !x.open) return false;
      if (!f.showClosed && !x.open) return false;
      if (f.busy.length) {
        if (!x.open) return false;
        if (!f.busy.includes(x.s.band)) return false;
      }
      return true;
    })
    .sort((a, b) => (b.open ? 1 : 0) - (a.open ? 1 : 0) || b.s.val - a.s.val);
}
