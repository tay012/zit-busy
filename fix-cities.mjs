import fs from 'fs';
const dir = 'src/data/venues';
const plan = {
  aus: { remove: ['Contigo', 'Rainey Street Icehouse'], set: { "P. Terry's": { open: 0, close: 24 }, 'Meanwhile Brewing': { area: 'South Austin' }, 'Elizabeth Street Cafe': { area: 'Bouldin Creek' } } },
  chi: { set: { 'Girl & The Goat': { area: 'West Loop' }, 'The Aviary': { area: 'West Loop' }, 'Metric Coffee Co.': { area: 'West Loop' }, 'Big Jones': { area: 'Andersonville' }, 'Smoque BBQ': { area: 'Old Irving Park' }, 'MFK Restaurant': { area: 'Lakeview' } } },
  dal: { set: { 'Stirr': { area: 'Deep Ellum' }, "Ellen's": { area: 'West End' }, 'Royal China': { area: 'Preston Royal' } } },
  hou: { remove: ['Underbelly Hospitality'], set: { "Killen's BBQ": { area: 'Pearland' }, 'Crawfish & Noodles': { area: 'Chinatown' }, 'Tacos Tierra Caliente': { area: 'Montrose' } } },
  phl: { set: { 'Essen Bakery': { area: 'East Passyunk' }, "Mike's BBQ": { area: 'East Passyunk' }, "John's Roast Pork": { cat: 'Deli', open: 9, close: 15 } } },
  sat: { set: { '2M Smokehouse': { area: 'Southeast Side' } } },
  sd: { set: { 'Raised by Wolves': { area: 'UTC' }, 'Extraordinary Desserts': { area: 'Little Italy' }, 'The Fish Market': { area: 'Embarcadero' } } },
};
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
function findVenue(t, name) {
  const m = new RegExp(`\\{\\s*name:\\s*"${esc(name)}"`).exec(t);
  if (!m) return null;
  let depth = 0, inStr = false;
  for (let i = m.index; i < t.length; i++) {
    const c = t[i];
    if (inStr) { if (c === '\\') i++; else if (c === '"') inStr = false; continue; }
    if (c === '"') inStr = true;
    else if (c === '{') depth++;
    else if (c === '}' && --depth === 0) return [m.index, i + 1];
  }
  return null;
}
for (const [city, p] of Object.entries(plan)) {
  const file = `${dir}/${city}.ts`;
  let t = fs.readFileSync(file, 'utf8');
  for (const name of p.remove || []) {
    const r = findVenue(t, name);
    if (!r) { console.log(`NOT FOUND ${city}: ${name}`); continue; }
    let [s, e] = r;
    if (t[e] === ',') e++;
    while (s > 0 && /\s/.test(t[s - 1])) s--;
    t = t.slice(0, s) + t.slice(e);
    console.log(`removed ${city}: ${name}`);
  }
  for (const [name, fields] of Object.entries(p.set || {})) {
    const r = findVenue(t, name);
    if (!r) { console.log(`NOT FOUND ${city}: ${name}`); continue; }
    let obj = t.slice(r[0], r[1]);
    for (const [k, v] of Object.entries(fields)) {
      const val = typeof v === 'string' ? `"${v}"` : String(v);
      obj = obj.replace(new RegExp(`(${k}:\\s*)("[^"]*"|[\\d.]+)`), `$1${val}`);
    }
    t = t.slice(0, r[0]) + obj + t.slice(r[1]);
    console.log(`updated ${city}: ${name}`);
  }
  fs.writeFileSync(file, t, 'utf8');
}
