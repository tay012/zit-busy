export type MenuItem = [string, string, string | number];
export type MenuSection = [string, MenuItem[]];
export type BusyCurve = number[];

export interface Season {
  from: string;
  to: string;
}

export interface Venue {
  name: string;
  cat: string;
  area: string;
  rating: number;
  reviews: number;
  price: 1 | 2 | 3;
  hue: number;
  photo: string;
  open: number;
  close: number;
  curve: BusyCurve;
  menu: MenuSection[];
  season?: Season;
}

export type BusyBand = "quiet" | "moderate" | "packed";

export interface VenueScore {
  val: number;
  band: BusyBand;
  src: string;
}

export interface ScoredVenue {
  v: Venue;
  s: VenueScore;
  open: boolean;
}

export interface FilterState {
  cat: string;
  q: string;
  favOnly: boolean;
  busy: BusyBand[];
  price: number[];
  area: string[];
  rating: number;
  showClosed: boolean;
  openOnly: boolean;
}

export interface Report {
  level: BusyBand;
  at: number;
  count: number;
}

export interface City {
  name: string;
}
