// Outbound search links for the detail panel.
//
// {query} in a template is replaced with the URL-encoded "name city" search.
// Fill in affiliateId once you have partner accounts. Leave it empty to send
// plain links. affiliateParam is the query-string key the ID is sent under;
// set it to null if the provider wants the ID somewhere else.

export type LinkProvider = 'opentable' | 'doordash' | 'ubereats';

interface ProviderConfig {
  label: string;
  template: string;
  affiliateParam: string | null;
  affiliateId: string;
}

export const PROVIDERS: Record<LinkProvider, ProviderConfig> = {
  opentable: {
    label: 'OpenTable',
    template: 'https://www.opentable.com/s?term={query}',
    affiliateParam: 'rid',
    affiliateId: '',
  },
  doordash: {
    label: 'DoorDash',
    template: 'https://www.doordash.com/search/store/{query}/',
    affiliateParam: null,
    affiliateId: '',
  },
  ubereats: {
    label: 'Uber Eats',
    template: 'https://www.ubereats.com/search?q={query}',
    affiliateParam: null,
    affiliateId: '',
  },
};

// Which provider each button goes to
export const RESERVE_PROVIDER: LinkProvider = 'opentable';
export const DELIVERY_PROVIDER: LinkProvider = 'doordash';

// Venue.cat values that get a Reserve button (sit-down places only)
export const RESERVABLE_CATS = [
  'Restaurants', 'Southern', 'Barbecue', 'Tacos', 'Brunch', 'Pizza', 'Seafood', 'Asian',
];

// Venue.cat values that never get a delivery button. Every other category
// is treated as a food place.
export const NO_DELIVERY_CATS = ['Bars', 'Entertainment'];

export function buildSearchUrl(provider: LinkProvider, query: string): string {
  const { template, affiliateParam, affiliateId } = PROVIDERS[provider];
  const url = new URL(template.replace('{query}', encodeURIComponent(query)));
  if (affiliateParam && affiliateId) {
    url.searchParams.set(affiliateParam, affiliateId);
  }
  return url.toString();
}
