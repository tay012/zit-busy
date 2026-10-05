import fs from 'fs';
const edits = {
  'index.html': [
    [`<title>Right Now</title>`, `<title>Is It Busy? | Richmond</title>`],
    [`content="Right Now"`, `content="Is It Busy?"`],
    [`See how busy restaurants, bars and coffee shops are right now in major US cities.`, `See how busy Richmond restaurants, bars and coffee shops usually are, hour by hour.`],
  ],
  'public/manifest.json': [
    [`"Right Now RVA"`, `"Is It Busy?"`],
    [`"short_name": "Right Now"`, `"short_name": "Is It Busy?"`],
    [`See how busy Richmond restaurants, bars and coffee shops are right now.`, `See how busy Richmond restaurants, bars and coffee shops usually are, hour by hour.`],
  ],
  'src/components/Footer.tsx': [
    [`Prototype. Busyness figures are placeholder data, not live readings. Photos and menus are placeholders.`, `Busyness is based on typical patterns for each hour, not live readings. Menus and prices are samples and may not be current.`],
  ],
  'src/data/venues/rva.ts': [
    [`{name:"Fat Dragon Short Pump", cat:"Restaurants", area:"Short Pump"`, `{name:"Fat Dragon", cat:"Restaurants", area:"Scott's Addition"`],
    [`{name:"Kabuto Japanese Steakhouse", cat:"Restaurants", area:"Short Pump"`, `{name:"Kabuto Japanese Steakhouse", cat:"Restaurants", area:"West End"`],
    [/\s*\{name:"World of Beer Short Pump"[\s\S]*?\]\]\]\]\},/, ``],
    [/\s*\{name:"Pearl Raw Bar"[\s\S]*?\]\]\]\]\},/, ``],
  ],
};
for (const [file, list] of Object.entries(edits)) {
  let t = fs.readFileSync(file, 'utf8');
  for (const [from, to] of list) {
    const hit = typeof from === 'string' ? t.includes(from) : from.test(t);
    if (!hit) { console.log(`NOT FOUND in ${file}: ${from}`); continue; }
    t = typeof from === 'string' ? t.replaceAll(from, to) : t.replace(from, to);
    console.log(`fixed ${file}`);
  }
  fs.writeFileSync(file, t, 'utf8');
}
