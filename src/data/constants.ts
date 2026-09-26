import type { BusyBand } from '../types';

export const CATS = [
  "All", "Fast food", "Coffee", "Bakery", "Sweets", "Restaurants",
  "Bars", "Southern", "Barbecue", "Tacos", "Deli", "Brunch",
  "Pizza", "Seafood", "Asian", "Entertainment"
];

export const LABEL: Record<BusyBand, string> = {
  quiet: "Not busy",
  moderate: "Steady",
  packed: "Packed",
};

export const WAITS: Record<BusyBand, string> = {
  quiet: "Walk right in",
  moderate: "Short wait",
  packed: "Expect a wait",
};

export const PRICE: Record<number, string> = {
  1: "$",
  2: "$$",
  3: "$$$",
};

export const REPORT_OPTIONS: [BusyBand, string, string][] = [
  ["quiet", "Not busy", "Seats available"],
  ["moderate", "Steady", "Filling up"],
  ["packed", "Packed", "There's a wait"],
];

export const TTL = 45 * 60 * 1000;
