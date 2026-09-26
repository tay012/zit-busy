import type { Venue } from '../types';

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export function inSeason(v: Venue, d = new Date()): boolean {
  if (!v.season) return true;
  const md =
    String(d.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(d.getDate()).padStart(2, "0");
  const { from, to } = v.season;
  return from <= to ? md >= from && md <= to : md >= from || md <= to;
}

export function seasonReopen(v: Venue): string {
  const [m, d] = v.season!.from.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}`;
}

export function nowH(): number {
  const d = new Date();
  return d.getHours() + d.getMinutes() / 60;
}

export function isOpen(v: Venue, t = nowH()): boolean {
  if (!inSeason(v)) return false;
  if (v.close > 24) return t >= v.open || t < v.close - 24;
  return t >= v.open && t < v.close;
}

export function fmt(h: number): string {
  h = ((h % 24) + 24) % 24;
  const hr = Math.floor(h);
  const m = Math.round((h - hr) * 60);
  const ap = hr < 12 ? "AM" : "PM";
  let d = hr % 12;
  if (d === 0) d = 12;
  return m ? `${d}:${String(m).padStart(2, "0")} ${ap}` : `${d} ${ap}`;
}

export function opensIn(v: Venue): string {
  if (!inSeason(v)) return `Closed for the season \u00B7 reopens ${seasonReopen(v)}`;
  const t = nowH();
  let diff = v.open - t;
  if (diff < 0) diff += 24;
  if (diff < 1) {
    const mins = Math.round(diff * 60);
    return mins < 1 ? "Opens any moment" : `Opens in ${mins} min`;
  }
  if (diff < 6) return `Opens at ${fmt(v.open)}`;
  return `Opens ${fmt(v.open)} tomorrow`;
}

export function peakWindow(v: Venue): string {
  let best = -1;
  let bi = 0;
  v.curve.forEach((p, i) => {
    if (p > best) {
      best = p;
      bi = i;
    }
  });
  const at = (i: number) => v.curve[((i % 24) + 24) % 24];
  let s = bi;
  let e = bi;
  let guard = 0;
  while (at(s - 1) > best * 0.7 && guard++ < 23) s--;
  guard = 0;
  while (at(e + 1) > best * 0.7 && guard++ < 23) e++;
  return `Usually busiest ${fmt(s)}\u2013${fmt(e + 1)}`;
}
