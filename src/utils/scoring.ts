import type { Venue, VenueScore, BusyBand, Report } from '../types';
import { TTL } from '../data/constants';

export function band(x: number): BusyBand {
  return x < 35 ? "quiet" : x < 68 ? "moderate" : "packed";
}

export function score(v: Venue, reports: Record<string, Report>): VenueScore {
  const d = new Date();
  const h = d.getHours();
  const f = d.getMinutes() / 60;
  const a = v.curve[h];
  const b = v.curve[(h + 1) % 24];
  let val = a + (b - a) * f;
  let src = "Based on typical patterns";

  const r = reports[v.name];
  if (r && Date.now() - r.at < TTL) {
    const tg: Record<BusyBand, number> = { quiet: 20, moderate: 50, packed: 85 };
    const w = 0.85 * (1 - (Date.now() - r.at) / TTL);
    val = val * (1 - w) + tg[r.level] * w;
    src =
      r.count +
      (r.count === 1 ? " person" : " people") +
      " reported this " +
      ago(r.at);
  }

  val = Math.max(0, Math.min(100, Math.round(val)));
  return { val, band: band(val), src };
}

export function ago(t: number): string {
  const m = Math.round((Date.now() - t) / 60000);
  return m < 1 ? "just now" : m + " min ago";
}
