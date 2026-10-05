import fs from 'fs';
const fix = process.argv.includes('--fix');
const dir = 'src/data/venues';
let issues = 0;
for (const f of fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'index.ts')) {
  const path = `${dir}/${f}`;
  let text = fs.readFileSync(path, 'utf8');
  text = text.replace(/(name:"([^"]+)"[\s\S]*?open:([\d.]+),\s*close:([\d.]+),[\s\S]*?curve:\[)([^\]]+)(\])/g,
    (m, pre, name, o, c, curve, post) => {
      const open = +o, close = +c;
      const vals = curve.split(',').map(Number);
      const isOpen = h => (h + 1 > open && h < close) || (close > 24 && h < close - 24);
      const bad = vals.map((v, h) => (v > 0 && !isOpen(h) ? h : -1)).filter(h => h >= 0);
      if (!bad.length) return m;
      issues++;
      console.log(`${f}: ${name} is busy at hour(s) ${bad.join(', ')} but open ${open}-${close}`);
      return pre + vals.map((v, h) => (bad.includes(h) ? 0 : v)).join(',') + post;
    });
  if (fix) fs.writeFileSync(path, text, 'utf8');
}
console.log(issues ? `${issues} venue(s) with issues${fix ? ' (fixed)' : ''}` : 'No issues found');
